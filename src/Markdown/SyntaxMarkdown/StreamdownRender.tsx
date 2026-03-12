'use client';

import { marked } from 'marked';
import { memo, useEffect, useId, useMemo, useRef } from 'react';
import Markdown, { type Options } from 'react-markdown';
import remend from 'remend';
import type { Pluggable, PluggableList } from 'unified';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';
import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import { rehypeStreamAnimated } from '@/Markdown/plugins/rehypeStreamAnimated';

import { styles } from './style';
import { useSmoothStreamContent } from './useSmoothStreamContent';
import { type BlockInfo, useStreamQueue } from './useStreamQueue';

const STREAM_FADE_DURATION = 280;
const STREAM_EXIT_BUFFER = 120;
const STREAM_EXIT_DELAY_MAX = 4000;
const STREAM_EXIT_DELAY_MIN = 400;
const STREAM_SPEED_DELAY_MAX = 36;
const STREAM_SPEED_DELAY_MIN = 6;

function countChars(text: string): number {
  return [...text].length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isDeepEqualValue = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqualValue(a[i], b[i])) return false;
    }
    return true;
  }

  if (!isRecord(a) || !isRecord(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!isDeepEqualValue(a[key], b[key])) return false;
  }

  return true;
};

const isSamePlugin = (prevPlugin: Pluggable, nextPlugin: Pluggable): boolean => {
  const prevTuple = Array.isArray(prevPlugin) ? prevPlugin : [prevPlugin];
  const nextTuple = Array.isArray(nextPlugin) ? nextPlugin : [nextPlugin];

  if (prevTuple.length !== nextTuple.length) return false;
  if (prevTuple[0] !== nextTuple[0]) return false;

  return isDeepEqualValue(prevTuple.slice(1), nextTuple.slice(1));
};

const isSamePlugins = (
  prevPlugins?: PluggableList | null,
  nextPlugins?: PluggableList | null,
): boolean => {
  if (prevPlugins === nextPlugins) return true;
  if (!prevPlugins || !nextPlugins) return !prevPlugins && !nextPlugins;
  if (prevPlugins.length !== nextPlugins.length) return false;

  for (let i = 0; i < prevPlugins.length; i++) {
    if (!isSamePlugin(prevPlugins[i], nextPlugins[i])) return false;
  }

  return true;
};

const useStablePlugins = (plugins: PluggableList): PluggableList => {
  const stableRef = useRef<PluggableList>(plugins);

  if (!isSamePlugins(stableRef.current, plugins)) {
    stableRef.current = plugins;
  }

  return stableRef.current;
};

const StreamdownBlock = memo<Options>(
  ({ children, ...rest }) => {
    return <Markdown {...rest}>{children}</Markdown>;
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.components === nextProps.components &&
    isSamePlugins(prevProps.rehypePlugins, nextProps.rehypePlugins) &&
    isSamePlugins(prevProps.remarkPlugins, nextProps.remarkPlugins),
);

StreamdownBlock.displayName = 'StreamdownBlock';

export const StreamdownRender = memo<Options>(({ children, ...rest }) => {
  const { onStreamAnimationDelayChange, streamSmoothingPreset = 'balanced' } = useMarkdownContext();
  const escapedContent = useMarkdownContent(children || '');
  const components = useMarkdownComponents();
  const baseRehypePlugins = useStablePlugins(useMarkdownRehypePlugins());
  const remarkPlugins = useStablePlugins(useMarkdownRemarkPlugins());
  const generatedId = useId();
  const { content: smoothedContent, metrics } = useSmoothStreamContent(
    typeof escapedContent === 'string' ? escapedContent : '',
    { preset: streamSmoothingPreset },
  );

  const processedContent = useMemo(() => {
    return remend(smoothedContent);
  }, [smoothedContent]);

  const blocks: BlockInfo[] = useMemo(() => {
    const tokens = marked.lexer(processedContent);
    let offset = 0;
    return tokens.map((token) => {
      const block = { content: token.raw, startOffset: offset };
      offset += token.raw.length;
      return block;
    });
  }, [processedContent]);

  const preferredCharDelay = clamp(
    1000 / Math.max(metrics.displayCps, 1),
    STREAM_SPEED_DELAY_MIN,
    STREAM_SPEED_DELAY_MAX,
  );
  const { getBlockState, charDelay } = useStreamQueue(blocks, { preferredCharDelay });
  const prevBlockCharCountRef = useRef<Map<number, number>>(new Map());
  const blockTimelineRef = useRef<Map<number, number>>(new Map());
  const lastRenderTsRef = useRef<number | null>(null);
  const lastReportedExitDelayRef = useRef<number | null>(null);

  const renderTs = typeof performance === 'undefined' ? Date.now() : performance.now();
  const frameDt =
    lastRenderTsRef.current === null
      ? 0
      : Math.max(0, Math.min(renderTs - lastRenderTsRef.current, 120));

  const timelineForRender = useMemo(() => {
    const next = new Map<number, number>();
    const prevTimeline = blockTimelineRef.current;
    const prevCharCounts = prevBlockCharCountRef.current;

    for (const block of blocks) {
      const blockCharCount = countChars(block.content);
      const prevCharCount = prevCharCounts.get(block.startOffset) ?? 0;
      const prevElapsed = prevTimeline.get(block.startOffset);
      const latestCharStart = Math.max(0, (blockCharCount - 1) * charDelay);

      if (prevElapsed === undefined || blockCharCount < prevCharCount) {
        next.set(block.startOffset, latestCharStart);
        continue;
      }

      const elapsedByTime = prevElapsed + frameDt;
      // Avoid huge hidden backlog when stream updates in bursts.
      const minElapsed = Math.max(0, latestCharStart - charDelay * 2);
      next.set(block.startOffset, Math.max(elapsedByTime, minElapsed));
    }

    return next;
  }, [blocks, charDelay, frameDt]);

  useEffect(() => {
    const nextCharCount = new Map<number, number>();
    for (const block of blocks) {
      nextCharCount.set(block.startOffset, countChars(block.content));
    }
    prevBlockCharCountRef.current = nextCharCount;
    blockTimelineRef.current = timelineForRender;
    lastRenderTsRef.current = typeof performance === 'undefined' ? Date.now() : performance.now();
  }, [blocks, timelineForRender]);

  useEffect(() => {
    if (!onStreamAnimationDelayChange) return;

    let maxRemainingAnimationMs = 0;

    for (const block of blocks) {
      const blockCharCount = countChars(block.content);
      if (blockCharCount === 0) continue;

      const latestCharStart = Math.max(0, (blockCharCount - 1) * charDelay);
      const elapsed = timelineForRender.get(block.startOffset) ?? 0;
      maxRemainingAnimationMs = Math.max(
        maxRemainingAnimationMs,
        latestCharStart + STREAM_FADE_DURATION - elapsed,
      );
    }

    const smoothingTailMs =
      metrics.backlogChars > 0
        ? (metrics.backlogChars * 1000) / Math.max(metrics.displayCps, 1)
        : 0;
    const nextExitDelay =
      Math.round(
        clamp(
          maxRemainingAnimationMs + smoothingTailMs + STREAM_EXIT_BUFFER,
          STREAM_EXIT_DELAY_MIN,
          STREAM_EXIT_DELAY_MAX,
        ) / 50,
      ) * 50;

    if (lastReportedExitDelayRef.current === nextExitDelay) return;
    lastReportedExitDelayRef.current = nextExitDelay;
    onStreamAnimationDelayChange(nextExitDelay);
  }, [
    blocks,
    charDelay,
    metrics.backlogChars,
    metrics.displayCps,
    onStreamAnimationDelayChange,
    timelineForRender,
  ]);

  return (
    <div className={styles.animated}>
      {blocks.map((block, index) => {
        const state = getBlockState(index);
        if (state === 'queued') return null;
        const timelineElapsedMs = timelineForRender.get(block.startOffset) ?? 0;

        let plugins: Pluggable[];
        if (state === 'streaming') {
          plugins = [
            ...baseRehypePlugins,
            [
              rehypeStreamAnimated,
              { charDelay, fadeDuration: STREAM_FADE_DURATION, timelineElapsedMs },
            ],
          ];
        } else if (state === 'animating') {
          // Continue from previously rendered progress instead of restarting
          // or force-switching to fully revealed.
          plugins = [
            ...baseRehypePlugins,
            [
              rehypeStreamAnimated,
              { charDelay, fadeDuration: STREAM_FADE_DURATION, timelineElapsedMs },
            ],
          ];
        } else {
          // Keep fade continuity for just-finished chars; avoid instant class
          // switch to stream-char-revealed that would cancel in-flight fades.
          plugins = [
            ...baseRehypePlugins,
            [
              rehypeStreamAnimated,
              { charDelay, fadeDuration: STREAM_FADE_DURATION, timelineElapsedMs },
            ],
          ];
        }

        return (
          <StreamdownBlock
            {...rest}
            components={components}
            key={`${generatedId}-${block.startOffset}`}
            rehypePlugins={plugins}
            remarkPlugins={remarkPlugins}
          >
            {block.content}
          </StreamdownBlock>
        );
      })}
    </div>
  );
});

StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
