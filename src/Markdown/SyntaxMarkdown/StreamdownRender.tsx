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
import { streamAnimationDebugLog } from './streamAnimation.debug';
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
  animationFrom: number;
  charDurationMs: number;
  deadlineAt: number;
  delayStepMs: number;
  startedAt: number;
}

interface StreamMachineState {
  active: ActiveStreamSegment | null;
  committedOffset: number;
  previousWindowContent: string;
  previousWindowLength: number;
  queue: StreamSegment[];
  renderBlocks: RenderBlock[];
}

const summarizeSegment = (segment: StreamSegment | ActiveStreamSegment | null) => {
  if (!segment) return null;

  return {
    blockId: segment.blockId,
    charCount: segment.charCount,
    disableAnimation: segment.disableAnimation,
    from: segment.from,
    id: segment.id,
    kind: segment.blockRenderKind,
    to: segment.to,
  };
};

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

const mergeQueuedSegments = (
  queue: StreamSegment[],
  incoming: StreamSegment[],
): StreamSegment[] => {
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

const canAppendToActiveSegment = (
  active: ActiveStreamSegment,
  segment: StreamSegment,
  cursor: number,
): boolean => {
  return (
    active.blockId === segment.blockId &&
    active.blockRenderKind === segment.blockRenderKind &&
    active.disableAnimation === segment.disableAnimation &&
    segment.from === cursor
  );
};

const pullActiveExtensionSegment = (
  active: ActiveStreamSegment,
  incoming: StreamSegment[],
): { extension: StreamSegment | null; remainingIncoming: StreamSegment[] } => {
  if (incoming.length === 0) {
    return { extension: null, remainingIncoming: incoming };
  }

  let cursor = active.to;
  let charCount = 0;
  let consumed = 0;
  let end = cursor;
  let lastId = active.id;

  for (let index = 0; index < incoming.length; index += 1) {
    const segment = incoming[index];
    if (!canAppendToActiveSegment(active, segment, cursor)) break;

    consumed += 1;
    cursor = segment.to;
    end = segment.to;
    charCount += segment.charCount;
    lastId = segment.id;
  }

  if (consumed === 0 || charCount === 0 || end <= active.to) {
    return { extension: null, remainingIncoming: incoming };
  }

  const extension: StreamSegment = {
    blockId: active.blockId,
    blockRenderKind: active.blockRenderKind,
    charCount,
    disableAnimation: active.disableAnimation,
    from: active.to,
    id: lastId,
    to: end,
  };

  return {
    extension,
    remainingIncoming: incoming.slice(consumed),
  };
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
      ? Math.min(
          streamAnimationOverlapMs,
          acceleratedTotalMs * STREAM_ANIMATION_TUNING.overlapLeadRatio,
        )
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
    const noAnimationLoggedSegmentRef = useRef<string | null>(null);
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
      (state: StreamMachineState, updater: (current: StreamMachineState) => StreamMachineState) =>
        updater(state),
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

    const applyMachine = useCallback(
      (updater: (state: StreamMachineState) => StreamMachineState) => {
        dispatchMachine(updater);
      },
      [],
    );

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
      const sharedPrefixLength = isAppendOnly
        ? previousWindowContent.length
        : getSharedPrefixLength(previousWindowContent, windowedContent);

      streamAnimationDebugLog('machine:window:incoming', {
        appendOnly: isAppendOnly,
        nextWindowLength: windowedContent.length,
        previousWindowLength: previousWindowContent.length,
        sharedPrefixLength,
      });

      applyMachine((previousState) => {
        const appendOnly = windowedContent.startsWith(previousState.previousWindowContent);
        const sharedPrefixLength = appendOnly
          ? previousState.previousWindowLength
          : getSharedPrefixLength(previousState.previousWindowContent, windowedContent);
        const rewindChars = appendOnly
          ? 0
          : Math.max(0, previousState.previousWindowLength - sharedPrefixLength);

        let baseState: StreamMachineState = previousState;

        if (!appendOnly) {
          const canSoftRewindActive = Boolean(
            previousState.active &&
              rewindChars > 0 &&
              rewindChars <= STREAM_ANIMATION_TUNING.softResetMaxRewindChars &&
              sharedPrefixLength >= previousState.active.from,
          );

          if (canSoftRewindActive && previousState.active) {
            const now = Date.now();
            const trimmedTo = Math.max(
              previousState.active.from,
              Math.min(previousState.active.to, sharedPrefixLength),
            );
            const trimmedRaw = windowedContent.slice(previousState.active.from, trimmedTo);
            const trimmedCharCount = Array.from(trimmedRaw).length;

            if (trimmedCharCount > 0) {
              const trimmedTiming = resolveSegmentTiming(
                {
                  ...previousState.active,
                  charCount: trimmedCharCount,
                  from: previousState.active.from,
                  to: trimmedTo,
                },
                previousState.queue.length,
                normalizedWindowMs,
                normalizedOverlapMs,
                streamAnimationBacklogRate,
              );
              const pacingTotalMs = Math.round(
                trimmedTiming.delayStepMs * Math.max(0, trimmedCharCount - 1) +
                  trimmedTiming.charDurationMs,
              );
              const active: ActiveStreamSegment = {
                ...previousState.active,
                charCount: trimmedCharCount,
                charDurationMs: trimmedTiming.charDurationMs,
                deadlineAt: Math.max(
                  now + STREAM_ANIMATION_LIMITS.minSegmentPlayMs,
                  previousState.active.startedAt + pacingTotalMs,
                ),
                delayStepMs: trimmedTiming.delayStepMs,
                to: trimmedTo,
              };

              streamAnimationDebugLog('machine:window:soft-rewind', {
                active: {
                  ...summarizeSegment(active),
                  animationFrom: active.animationFrom,
                  deadlineAt: active.deadlineAt,
                  startedAt: active.startedAt,
                },
                rewindChars,
                sharedPrefixLength,
              });

              baseState = {
                ...previousState,
                active,
                committedOffset: Math.min(previousState.committedOffset, sharedPrefixLength),
                previousWindowContent: previousState.previousWindowContent.slice(0, sharedPrefixLength),
                previousWindowLength: sharedPrefixLength,
                queue: [],
              };
            } else {
              streamAnimationDebugLog('machine:window:hard-reset', {
                reason: 'soft-rewind-empty-active',
                rewindChars,
                sharedPrefixLength,
              });
              baseState = {
                ...previousState,
                active: null,
                committedOffset: Math.min(previousState.committedOffset, sharedPrefixLength),
                previousWindowContent: previousState.previousWindowContent.slice(0, sharedPrefixLength),
                previousWindowLength: sharedPrefixLength,
                queue: [],
              };
            }
          } else {
            streamAnimationDebugLog('machine:window:hard-reset', {
              reason: 'non-append-window',
              rewindChars,
              sharedPrefixLength,
            });
            baseState = {
              ...previousState,
              active: null,
              committedOffset: Math.min(previousState.committedOffset, sharedPrefixLength),
              previousWindowContent: previousState.previousWindowContent.slice(
                0,
                sharedPrefixLength,
              ),
              previousWindowLength: sharedPrefixLength,
              queue: [],
            };
          }
        }

        const parsedBlocks = parseMarkdownIntoBlocks(windowedContent);
        const reconciledBlocks = reconcileBlocks(
          baseState.renderBlocks,
          parsedBlocks,
          createBlockId,
        );
        const fromOffset = Math.min(baseState.previousWindowLength, windowedContent.length);
        const toOffset = windowedContent.length;
        const incomingSegments = buildStreamSegments(
          reconciledBlocks,
          windowedContent,
          fromOffset,
          toOffset,
          createSegmentId,
        );
        const incomingCharCount = incomingSegments.reduce(
          (sum, segment) => sum + segment.charCount,
          0,
        );
        let active = baseState.active;
        let pendingSegments = incomingSegments;

        if (active) {
          const { extension, remainingIncoming } = pullActiveExtensionSegment(
            active,
            pendingSegments,
          );
          pendingSegments = remainingIncoming;

          if (extension) {
            const backlogSize = baseState.queue.length + pendingSegments.length;
            const extensionTiming = resolveSegmentTiming(
              extension,
              backlogSize,
              normalizedWindowMs,
              normalizedOverlapMs,
              streamAnimationBacklogRate,
            );
            const nextCharCount = active.charCount + extension.charCount;
            const totalTiming = resolveSegmentTiming(
              {
                ...extension,
                charCount: nextCharCount,
                from: active.from,
              },
              backlogSize,
              normalizedWindowMs,
              normalizedOverlapMs,
              streamAnimationBacklogRate,
            );

            const now = Date.now();
            const remainingMs = Math.max(0, active.deadlineAt - now);
            const extensionCarryMs = Math.max(
              STREAM_ANIMATION_LIMITS.minSegmentPlayMs,
              Math.round(
                extensionTiming.playMs * STREAM_ANIMATION_TUNING.activeExtensionCarryRatio,
              ),
            );
            const pacingTotalMs = Math.round(
              totalTiming.delayStepMs * Math.max(0, nextCharCount - 1) + totalTiming.charDurationMs,
            );
            const minimumDeadlineByPacing = active.startedAt + pacingTotalMs;

            active = {
              ...active,
              charCount: nextCharCount,
              charDurationMs: totalTiming.charDurationMs,
              deadlineAt: Math.max(active.deadlineAt + extensionCarryMs, minimumDeadlineByPacing),
              delayStepMs: totalTiming.delayStepMs,
              to: extension.to,
            };

            streamAnimationDebugLog('machine:active:extend', {
              backlogSize,
              extension: summarizeSegment(extension),
              extensionCarryMs,
              extensionTiming,
              minimumDeadlineByPacing,
              nextActive: {
                ...summarizeSegment(active),
                animationFrom: active.animationFrom,
                deadlineAt: active.deadlineAt,
                startedAt: active.startedAt,
              },
              pacingTotalMs,
              remainingMs,
              totalTiming,
            });
          }
        }

        const queue = mergeQueuedSegments(baseState.queue, pendingSegments);
        const queueCharCount = queue.reduce((sum, segment) => sum + segment.charCount, 0);

        streamAnimationDebugLog('machine:window:applied', {
          active: active
            ? {
                ...summarizeSegment(active),
                animationFrom: active.animationFrom,
                deadlineAt: active.deadlineAt,
              }
            : null,
          appendOnly,
          fromOffset,
          incomingCharCount,
          incomingSegmentCount: incomingSegments.length,
          pendingSegmentCount: pendingSegments.length,
          queueCharCount,
          queueLength: queue.length,
          sharedPrefixLength,
          toOffset,
        });

        return {
          ...baseState,
          active,
          committedOffset: Math.min(baseState.committedOffset, toOffset),
          previousWindowContent: windowedContent,
          previousWindowLength: toOffset,
          queue,
          renderBlocks: reconciledBlocks,
        };
      });
    }, [
      windowedContent,
      applyMachine,
      createBlockId,
      createSegmentId,
      normalizedOverlapMs,
      normalizedWindowMs,
      streamAnimationBacklogRate,
    ]);

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
        const now = Date.now();

        const activeSegment: ActiveStreamSegment = {
          ...nextSegment,
          animationFrom: nextSegment.from,
          ...timing,
          deadlineAt: now + timing.playMs,
          startedAt: now,
        };

        streamAnimationDebugLog('machine:active:start', {
          active: {
            ...summarizeSegment(activeSegment),
            animationFrom: activeSegment.animationFrom,
            deadlineAt: activeSegment.deadlineAt,
            startedAt: activeSegment.startedAt,
          },
          backlogAfterStart: remainingQueue.length,
          timing,
        });

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
    const activeSegmentDeadlineAt = machine.active?.deadlineAt;

    useEffect(() => {
      if (!machine.active) {
        noAnimationLoggedSegmentRef.current = null;
        return;
      }

      if (!machine.active.disableAnimation) return;
      if (noAnimationLoggedSegmentRef.current === machine.active.id) return;

      noAnimationLoggedSegmentRef.current = machine.active.id;
      streamAnimationDebugLog('machine:active:disable-animation', {
        active: {
          ...summarizeSegment(machine.active),
          animationFrom: machine.active.animationFrom,
          deadlineAt: machine.active.deadlineAt,
          startedAt: machine.active.startedAt,
        },
        reason: 'segment-marked-disableAnimation',
      });
    }, [machine.active]);

    useEffect(() => {
      clearCompletionTimer();

      if (!machine.active) {
        return () => {};
      }

      const segmentId = machine.active.id;
      const timeoutMs = Math.max(0, machine.active.deadlineAt - Date.now());
      streamAnimationDebugLog('machine:active:schedule-complete', {
        active: {
          ...summarizeSegment(machine.active),
          animationFrom: machine.active.animationFrom,
          deadlineAt: machine.active.deadlineAt,
          startedAt: machine.active.startedAt,
        },
        timeoutMs,
      });
      completionTimerRef.current = setTimeout(() => {
        applyMachine((previousState) => {
          if (!previousState.active || previousState.active.id !== segmentId) return previousState;

          streamAnimationDebugLog('machine:active:complete', {
            active: {
              ...summarizeSegment(previousState.active),
              animationFrom: previousState.active.animationFrom,
              deadlineAt: previousState.active.deadlineAt,
              startedAt: previousState.active.startedAt,
            },
            queueLength: previousState.queue.length,
          });

          return {
            ...previousState,
            active: null,
            committedOffset: Math.max(previousState.committedOffset, previousState.active.to),
          };
        });
      }, timeoutMs);

      return () => {
        if (!completionTimerRef.current) return;
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = null;
      };
    }, [
      activeSegmentDeadlineAt,
      activeSegmentId,
      applyMachine,
      clearCompletionTimer,
      machine.active,
    ]);

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
        machine.active
          ? Math.max(machine.committedOffset, machine.active.to)
          : machine.committedOffset,
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
            block.endOffset > activeSegment.animationFrom
          ) {
            const relativeStart = Math.max(0, activeSegment.animationFrom - block.startOffset);
            const relativeEnd = Math.min(block.raw.length, activeSegment.to - block.startOffset);
            const animatedRawChunk = block.raw.slice(relativeStart, relativeEnd);
            const tailChars = Array.from(animatedRawChunk).length;

            if (tailChars > 0) {
              const elapsedMsRaw = Math.max(0, Date.now() - activeSegment.startedAt);
              const tailMaxDelayMs = activeSegment.delayStepMs * Math.max(0, tailChars - 1);
              const maxElapsedMs =
                tailMaxDelayMs +
                activeSegment.charDurationMs * STREAM_ANIMATION_TUNING.elapsedTailGraceRatio;
              const elapsedMs = Math.min(elapsedMsRaw, maxElapsedMs);
              animationOptions = {
                charDurationMs: activeSegment.charDurationMs,
                delayStepMs: activeSegment.delayStepMs,
                elapsedMs,
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
