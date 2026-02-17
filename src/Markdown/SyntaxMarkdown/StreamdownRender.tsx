'use client';

import { memo, useCallback, useEffect, useId, useMemo, useReducer, useRef } from 'react';
import Markdown, { type Options } from 'react-markdown';
import remend from 'remend';
import { type Pluggable } from 'unified';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';
import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import {
  rehypeStreamAnimated,
  type RehypeStreamAnimatedOptions,
} from '@/Markdown/plugins/rehypeStreamAnimated';

import { parseMarkdownIntoBlocks, type RenderBlock } from './blockRenderKind';
import { reconcileBlocks } from './reconcileBlocks';
import {
  STREAM_ANIMATION_DEFAULTS,
  STREAM_ANIMATION_LIMITS,
  STREAM_ANIMATION_TUNING,
} from './streamAnimation.constants';
import { styles } from './style';
import { useWindowedStreamContent } from './useWindowedStreamContent';

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const getSharedPrefixLength = (previous: string, current: string): number => {
  const maxLength = Math.min(previous.length, current.length);
  let cursor = 0;

  while (cursor < maxLength && previous[cursor] === current[cursor]) {
    cursor += 1;
  }

  return cursor;
};

interface StreamSegment {
  blockId: string;
  blockRenderKind: string;
  charCount: number;
  disableAnimation: boolean;
  from: number;
  id: string;
  to: number;
}

interface ActiveStreamSegment extends StreamSegment {
  charDurationMs: number;
  delayStepMs: number;
  playMs: number;
}

interface StreamMachineState {
  active: ActiveStreamSegment | null;
  committedOffset: number;
  previousWindowContent: string;
  previousWindowLength: number;
  queue: StreamSegment[];
  renderBlocks: RenderBlock[];
}

const isStreamAnimationPlugin = (plugin: Pluggable): boolean => {
  if (plugin === rehypeStreamAnimated) return true;
  return Array.isArray(plugin) && plugin[0] === rehypeStreamAnimated;
};

const buildStreamSegments = (
  blocks: RenderBlock[],
  content: string,
  fromOffset: number,
  toOffset: number,
  createSegmentId: () => string,
): StreamSegment[] => {
  if (toOffset <= fromOffset) return [];

  const segments: StreamSegment[] = [];

  for (const block of blocks) {
    if (block.endOffset <= fromOffset) continue;
    if (block.startOffset >= toOffset) break;

    const segmentStart = Math.max(fromOffset, block.startOffset);
    const segmentEnd = Math.min(toOffset, block.endOffset);
    if (segmentEnd <= segmentStart) continue;

    const segmentText = content.slice(segmentStart, segmentEnd);
    const charCount = Array.from(segmentText).length;
    if (charCount <= 0) continue;

    segments.push({
      blockId: block.id,
      blockRenderKind: block.renderKind,
      charCount,
      disableAnimation: block.disableAnimation,
      from: segmentStart,
      id: createSegmentId(),
      to: segmentEnd,
    });
  }

  return segments;
};

const mergeQueuedSegments = (queue: StreamSegment[], incoming: StreamSegment[]): StreamSegment[] => {
  if (incoming.length === 0) return queue;
  if (queue.length === 0) return [...incoming];

  const merged: StreamSegment[] = [...queue];

  for (const segment of incoming) {
    const last = merged.at(-1);

    if (
      last &&
      last.blockId === segment.blockId &&
      last.to === segment.from &&
      last.disableAnimation === segment.disableAnimation &&
      last.blockRenderKind === segment.blockRenderKind
    ) {
      merged[merged.length - 1] = {
        ...last,
        charCount: last.charCount + segment.charCount,
        id: segment.id,
        to: segment.to,
      };
      continue;
    }

    merged.push(segment);
  }

  return merged;
};

const resolveSegmentTiming = (
  segment: StreamSegment,
  backlogSize: number,
  streamAnimationWindowMs: number,
  streamAnimationOverlapMs: number,
  streamAnimationBacklogRate: number,
) => {
  if (segment.disableAnimation) {
    return {
      charDurationMs: STREAM_ANIMATION_LIMITS.minCharDurationMs,
      delayStepMs: 0,
      playMs: STREAM_ANIMATION_LIMITS.minSegmentPlayMs,
    };
  }

  const charCount = Math.max(1, segment.charCount);
  const delayStepMs = clamp(
    streamAnimationWindowMs / charCount,
    STREAM_ANIMATION_LIMITS.minCharDelayMs,
    STREAM_ANIMATION_LIMITS.maxCharDelayMs,
  );
  const charDurationMs = clamp(
    delayStepMs * STREAM_ANIMATION_TUNING.charDurationMultiplier,
    STREAM_ANIMATION_LIMITS.minCharDurationMs,
    STREAM_ANIMATION_LIMITS.maxCharDurationMs,
  );
  const naturalTotalMs = delayStepMs * Math.max(0, charCount - 1) + charDurationMs;

  const backlogSpeed = 1 + backlogSize * Math.max(0, streamAnimationBacklogRate);
  const acceleratedTotalMs = naturalTotalMs / backlogSpeed;
  const overlapLeadMs =
    backlogSize > 0
      ? Math.min(streamAnimationOverlapMs, acceleratedTotalMs * STREAM_ANIMATION_TUNING.overlapLeadRatio)
      : 0;
  const playMs = clamp(
    acceleratedTotalMs - overlapLeadMs,
    STREAM_ANIMATION_LIMITS.minSegmentPlayMs,
    STREAM_ANIMATION_LIMITS.maxSegmentPlayMs,
  );

  return {
    charDurationMs: Math.round(charDurationMs),
    delayStepMs: Number(delayStepMs.toFixed(2)),
    playMs: Math.round(playMs),
  };
};

const toVisibleBlocks = (blocks: RenderBlock[], visibleOffset: number): RenderBlock[] => {
  if (visibleOffset <= 0 || blocks.length === 0) return [];

  const visibleBlocks: RenderBlock[] = [];

  for (const block of blocks) {
    if (block.startOffset >= visibleOffset) break;

    if (block.endOffset <= visibleOffset) {
      visibleBlocks.push(block);
      continue;
    }

    const partialLength = Math.max(0, visibleOffset - block.startOffset);
    visibleBlocks.push({
      ...block,
      endOffset: block.startOffset + partialLength,
      raw: block.raw.slice(0, partialLength),
    });
    break;
  }

  return visibleBlocks;
};

const StreamdownBlock = memo<Options>(({ children, ...rest }) => {
  return <Markdown {...rest}>{children}</Markdown>;
});

StreamdownBlock.displayName = 'StreamdownBlock';

export const StreamdownRender = memo<Options>(
  ({ children, ...rest }) => {
    const escapedContent = useMarkdownContent(children || '');
    const {
      streamAnimationBacklogRate = STREAM_ANIMATION_DEFAULTS.backlogRate,
      streamAnimationOverlapMs = STREAM_ANIMATION_DEFAULTS.overlapMs,
      streamAnimationWindowMs = STREAM_ANIMATION_DEFAULTS.windowMs,
    } = useMarkdownContext();
    const components = useMarkdownComponents();
    const rehypePluginsList = useMarkdownRehypePlugins();
    const remarkPluginsList = useMarkdownRemarkPlugins();
    const generatedId = useId();
    const segmentSeqRef = useRef(0);
    const blockSeqRef = useRef(0);
    const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const processedContent = useMemo(() => {
      const content = typeof escapedContent === 'string' ? escapedContent : '';
      return remend(content);
    }, [escapedContent]);
    const normalizedWindowMs = Math.max(
      STREAM_ANIMATION_LIMITS.minWindowMs,
      Math.round(streamAnimationWindowMs),
    );
    const normalizedOverlapMs = Math.max(0, Math.round(streamAnimationOverlapMs));
    const windowedContent = useWindowedStreamContent(processedContent, {
      enabled: true,
      windowMs: normalizedWindowMs,
    });

    const createBlockId = useCallback(() => {
      const id = `${generatedId}-block_${blockSeqRef.current}`;
      blockSeqRef.current += 1;
      return id;
    }, [generatedId]);

    const createSegmentId = useCallback(() => {
      const id = `${generatedId}-segment_${segmentSeqRef.current}`;
      segmentSeqRef.current += 1;
      return id;
    }, [generatedId]);

    const [machine, dispatchMachine] = useReducer(
      (
        state: StreamMachineState,
        updater: (current: StreamMachineState) => StreamMachineState,
      ) => updater(state),
      {
        active: null,
        committedOffset: 0,
        previousWindowContent: '',
        previousWindowLength: 0,
        queue: [],
        renderBlocks: [],
      },
    );

    const machineRef = useRef(machine);

    const applyMachine = useCallback((updater: (state: StreamMachineState) => StreamMachineState) => {
      dispatchMachine(updater);
    }, []);

    useEffect(() => {
      machineRef.current = machine;
    }, [machine]);

    const clearCompletionTimer = useCallback(() => {
      if (!completionTimerRef.current) return;
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }, []);

    useEffect(() => {
      const previousWindowContent = machineRef.current.previousWindowContent;
      const isAppendOnly = windowedContent.startsWith(previousWindowContent);

      if (!isAppendOnly) {
        clearCompletionTimer();
      }

      applyMachine((previousState) => {
        const appendOnly = windowedContent.startsWith(previousState.previousWindowContent);
        const sharedPrefixLength = appendOnly
          ? previousState.previousWindowLength
          : getSharedPrefixLength(previousState.previousWindowContent, windowedContent);

        const baseState: StreamMachineState = appendOnly
          ? previousState
          : {
              ...previousState,
              active: null,
              committedOffset: Math.min(previousState.committedOffset, sharedPrefixLength),
              previousWindowContent: previousState.previousWindowContent.slice(0, sharedPrefixLength),
              previousWindowLength: sharedPrefixLength,
              queue: [],
            };

        const parsedBlocks = parseMarkdownIntoBlocks(windowedContent);
        const reconciledBlocks = reconcileBlocks(baseState.renderBlocks, parsedBlocks, createBlockId);
        const fromOffset = Math.min(baseState.previousWindowLength, windowedContent.length);
        const toOffset = windowedContent.length;
        const incomingSegments = buildStreamSegments(
          reconciledBlocks,
          windowedContent,
          fromOffset,
          toOffset,
          createSegmentId,
        );
        const queue = mergeQueuedSegments(baseState.queue, incomingSegments);

        return {
          ...baseState,
          committedOffset: Math.min(baseState.committedOffset, toOffset),
          previousWindowContent: windowedContent,
          previousWindowLength: toOffset,
          queue,
          renderBlocks: reconciledBlocks,
        };
      });
    }, [windowedContent, applyMachine, clearCompletionTimer, createBlockId, createSegmentId]);

    useEffect(() => {
      if (machine.active || machine.queue.length === 0) return;

      applyMachine((previousState) => {
        if (previousState.active || previousState.queue.length === 0) return previousState;

        const [nextSegment, ...remainingQueue] = previousState.queue;
        const timing = resolveSegmentTiming(
          nextSegment,
          remainingQueue.length,
          normalizedWindowMs,
          normalizedOverlapMs,
          streamAnimationBacklogRate,
        );

        const activeSegment: ActiveStreamSegment = {
          ...nextSegment,
          ...timing,
        };

        return {
          ...previousState,
          active: activeSegment,
          queue: remainingQueue,
        };
      });
    }, [
      applyMachine,
      machine.active,
      machine.queue.length,
      normalizedOverlapMs,
      normalizedWindowMs,
      streamAnimationBacklogRate,
    ]);

    const activeSegmentId = machine.active?.id;
    const activeSegmentPlayMs = machine.active?.playMs;

    useEffect(() => {
      clearCompletionTimer();

      if (!machine.active) {
        return () => {};
      }

      const segmentId = machine.active.id;
      completionTimerRef.current = setTimeout(() => {
        applyMachine((previousState) => {
          if (!previousState.active || previousState.active.id !== segmentId) return previousState;

          return {
            ...previousState,
            active: null,
            committedOffset: Math.max(previousState.committedOffset, previousState.active.to),
          };
        });
      }, machine.active.playMs);

      return () => {
        if (!completionTimerRef.current) return;
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = null;
      };
    }, [activeSegmentId, activeSegmentPlayMs, applyMachine, clearCompletionTimer, machine.active]);

    useEffect(
      () => () => {
        if (!completionTimerRef.current) return;
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = null;
      },
      [],
    );

    const baseRehypePlugins = useMemo(
      () => rehypePluginsList.filter((plugin) => !isStreamAnimationPlugin(plugin)),
      [rehypePluginsList],
    );

    const visibleOffset = Math.max(
      0,
      Math.min(
        machine.previousWindowLength,
        machine.active ? Math.max(machine.committedOffset, machine.active.to) : machine.committedOffset,
      ),
    );

    const visibleBlocks = useMemo(
      () => toVisibleBlocks(machine.renderBlocks, visibleOffset),
      [machine.renderBlocks, visibleOffset],
    );

    return (
      <div className={styles.animated}>
        {visibleBlocks.map((block) => {
          const activeSegment = machine.active;
          let animationOptions: RehypeStreamAnimatedOptions | undefined;

          if (
            activeSegment &&
            !activeSegment.disableAnimation &&
            block.renderKind === activeSegment.blockRenderKind &&
            block.startOffset < activeSegment.to &&
            block.endOffset > activeSegment.from
          ) {
            const relativeStart = Math.max(0, activeSegment.from - block.startOffset);
            const relativeEnd = Math.min(block.raw.length, activeSegment.to - block.startOffset);
            const animatedRawChunk = block.raw.slice(relativeStart, relativeEnd);
            const tailChars = Array.from(animatedRawChunk).length;

            if (tailChars > 0) {
              animationOptions = {
                charDurationMs: activeSegment.charDurationMs,
                delayStepMs: activeSegment.delayStepMs,
                tailChars,
              };
            }
          }

          const rehypePlugins: Pluggable[] = animationOptions
            ? [
                ...baseRehypePlugins,
                [rehypeStreamAnimated as Pluggable, animationOptions] as unknown as Pluggable,
              ]
            : baseRehypePlugins;

          return (
            <StreamdownBlock
              {...rest}
              components={components}
              key={block.id}
              rehypePlugins={rehypePlugins}
              remarkPlugins={remarkPluginsList}
            >
              {block.raw}
            </StreamdownBlock>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
