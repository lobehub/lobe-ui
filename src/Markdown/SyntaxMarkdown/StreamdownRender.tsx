'use client';

import { memo, useEffect, useId, useMemo, useRef } from 'react';
import Markdown, { type Options } from 'react-markdown';
import remend from 'remend';
import { type Pluggable } from 'unified';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';

import { rehypeStreamAnimated } from '../plugins/rehypeStreamAnimated';
import { parseMarkdownIntoBlocks, type RenderBlock } from './blockRenderKind';
import { reconcileBlocks } from './reconcileBlocks';
import { styles } from './style';
import { useWindowedStreamContent } from './useWindowedStreamContent';

interface StreamdownRenderProps extends Options {
  streamAnimationDurationMs?: number;
  streamAnimationWindowMs?: number;
}

interface BlockAnimationRange {
  end: number;
  key: string;
  start: number;
}

interface BlockAnimationState extends BlockAnimationRange {
  createdAt: number;
}

interface BlockRenderPlan {
  block: RenderBlock;
  localOffset: number;
  ranges: BlockAnimationRange[];
}

const STREAM_DEBUG_FLAG = '__LOBE_MARKDOWN_STREAM_DEBUG__';

const sharedPrefixLength = (previous: string, current: string): number => {
  const minLength = Math.min(previous.length, current.length);
  let index = 0;

  while (index < minLength && previous[index] === current[index]) {
    index += 1;
  }

  return index;
};

const getAnimateFromOffset = (
  previousContent: string | undefined,
  currentContent: string,
): number => {
  if (previousContent === undefined) return 0;
  if (previousContent === currentContent) return currentContent.length;

  if (currentContent.startsWith(previousContent)) return previousContent.length;
  if (previousContent.startsWith(currentContent)) return currentContent.length;

  const prefix = sharedPrefixLength(previousContent, currentContent);
  return prefix === 0 ? currentContent.length : prefix;
};

const resolveStreamAnimationDurationMs = (
  streamAnimationWindowMs: number,
  streamAnimationDurationMs?: number,
) => {
  if (typeof streamAnimationDurationMs === 'number') {
    return Math.max(streamAnimationDurationMs, 0);
  }

  const base = streamAnimationWindowMs > 0 ? streamAnimationWindowMs * 1.8 : 180;
  return Math.min(200, Math.max(150, Math.round(base)));
};

const StreamdownBlock = memo<Options>(
  ({ children, ...rest }) => {
    return <Markdown {...rest}>{children}</Markdown>;
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

StreamdownBlock.displayName = 'StreamdownBlock';

export const StreamdownRender = memo<StreamdownRenderProps>(
  ({
    children,
    streamAnimationDurationMs,
    streamAnimationWindowMs = 200,
    ...rest
  }: StreamdownRenderProps) => {
    const escapedContent = useMarkdownContent(children || '');
    const components = useMarkdownComponents();
    const rehypePluginsList = useMarkdownRehypePlugins();
    const remarkPluginsList = useMarkdownRemarkPlugins();
    const previousBlocksRef = useRef<RenderBlock[]>([]);
    const activeAnimationByBlockRef = useRef<Map<string, BlockAnimationState>>(new Map());
    const previousProcessedContentRef = useRef<string | undefined>(undefined);
    const animateFromGlobalOffsetCacheRef = useRef<{ content: string; offset: number } | undefined>(
      undefined,
    );
    const debugRenderCountRef = useRef(0);
    const blockIdCounterRef = useRef(0);
    const generatedId = useId();
    const rawContent = typeof escapedContent === 'string' ? escapedContent : '';
    const windowedContent = useWindowedStreamContent(rawContent, streamAnimationWindowMs);
    const debugEnabled =
      typeof window !== 'undefined' &&
      (window as typeof window & Record<string, unknown>)[STREAM_DEBUG_FLAG] === true;
    const resolvedStreamAnimationDurationMs = useMemo(
      () => resolveStreamAnimationDurationMs(streamAnimationWindowMs, streamAnimationDurationMs),
      [streamAnimationDurationMs, streamAnimationWindowMs],
    );
    const processedContent = useMemo(() => {
      return remend(windowedContent);
    }, [windowedContent]);

    const parsedBlocks = useMemo(
      () => parseMarkdownIntoBlocks(processedContent),
      [processedContent],
    );
    const blocks = useMemo(
      () =>
        reconcileBlocks(previousBlocksRef.current, parsedBlocks, () => {
          const blockId = `${generatedId}-block_${blockIdCounterRef.current}`;
          blockIdCounterRef.current += 1;
          return blockId;
        }),
      [generatedId, parsedBlocks],
    );
    const animateFromGlobalOffset = useMemo(() => {
      const cached = animateFromGlobalOffsetCacheRef.current;
      if (cached && cached.content === processedContent) {
        return cached.offset;
      }

      const previousProcessedContent = previousProcessedContentRef.current;
      const offset = getAnimateFromOffset(previousProcessedContent, processedContent);
      animateFromGlobalOffsetCacheRef.current = { content: processedContent, offset };
      return offset;
    }, [processedContent]);
    const rehypePluginsWithoutAnimation = useMemo(
      () =>
        rehypePluginsList.filter((plugin) => {
          const pluginEntry = Array.isArray(plugin) ? plugin[0] : plugin;
          return pluginEntry !== rehypeStreamAnimated;
        }),
      [rehypePluginsList],
    );
    const { nextActiveAnimationByBlock, plans } = useMemo(() => {
      const now = Date.now();
      const nextRanges = new Map<string, BlockAnimationState>();
      const previousRanges = activeAnimationByBlockRef.current;
      const nextPlans: BlockRenderPlan[] = [];

      for (const block of blocks) {
        const localOffset = Math.min(
          Math.max(animateFromGlobalOffset - block.startOffset, 0),
          block.raw.length,
        );
        const ranges: BlockAnimationRange[] = [];
        const previousRange = previousRanges.get(block.id);

        const isPreviousRangeActive =
          !!previousRange && now - previousRange.createdAt < resolvedStreamAnimationDurationMs;
        if (isPreviousRangeActive) {
          const previousStart = Math.min(previousRange.start, block.raw.length);
          const previousEnd = Math.min(previousRange.end, block.raw.length);
          if (previousStart < previousEnd) {
            ranges.push({
              end: previousEnd,
              key: previousRange.key,
              start: previousStart,
            });
          }
        }

        let latestRange = previousRange;
        if (!block.disableAnimation && localOffset < block.raw.length) {
          const nextStart = localOffset;
          const nextEnd = block.raw.length;
          const shouldReusePreviousRange =
            !!previousRange && previousRange.start === nextStart && previousRange.end === nextEnd;

          if (!shouldReusePreviousRange) {
            latestRange = {
              createdAt: now,
              end: nextEnd,
              key: `${block.id}-range-${nextStart}-${nextEnd}`,
              start: nextStart,
            };
          }

          const rangeCandidate = latestRange;
          if (
            rangeCandidate &&
            !ranges.some(
              (range) => range.start === rangeCandidate.start && range.end === rangeCandidate.end,
            )
          ) {
            const nextRange = rangeCandidate;
            ranges.push({
              end: nextRange.end,
              key: nextRange.key,
              start: nextRange.start,
            });
          }
        }

        if (latestRange && !block.disableAnimation) {
          nextRanges.set(block.id, latestRange);
        }

        ranges.sort((left, right) => left.start - right.start);
        nextPlans.push({
          block,
          localOffset,
          ranges,
        });
      }

      return { nextActiveAnimationByBlock: nextRanges, plans: nextPlans };
    }, [animateFromGlobalOffset, blocks, resolvedStreamAnimationDurationMs]);

    const getRehypePluginsForPlan = (plan: BlockRenderPlan): Pluggable[] => {
      if (plan.ranges.length === 0) {
        return rehypePluginsWithoutAnimation;
      }

      return rehypePluginsList.map((plugin): Pluggable => {
        const pluginEntry = Array.isArray(plugin) ? plugin[0] : plugin;
        if (pluginEntry !== rehypeStreamAnimated) return plugin;

        return [
          rehypeStreamAnimated,
          {
            animateRanges: plan.ranges,
            animationDurationMs: resolvedStreamAnimationDurationMs,
          },
        ] as unknown as Pluggable;
      });
    };

    useEffect(() => {
      if (debugEnabled) {
        const debugIndex = debugRenderCountRef.current;
        debugRenderCountRef.current += 1;

        console.groupCollapsed(
          `[StreamdownRender] #${debugIndex} prev=${previousProcessedContentRef.current?.length ?? 0} curr=${processedContent.length} global=${animateFromGlobalOffset} raw=${rawContent.length} windowed=${windowedContent.length} duration=${resolvedStreamAnimationDurationMs}`,
        );
        console.table(
          plans.map((plan) => {
            const block = plan.block;
            return {
              disableAnimation: block.disableAnimation,
              end: block.endOffset,
              id: block.id,
              localOffset: plan.localOffset,
              rawLength: block.raw.length,
              ranges: plan.ranges.map((range) => `${range.start}-${range.end}`).join(','),
              renderKind: block.renderKind,
              sample: block.raw.slice(0, 64).replaceAll('\n', '\\n'),
              start: block.startOffset,
            };
          }),
        );
        console.groupEnd();
      }

      activeAnimationByBlockRef.current = nextActiveAnimationByBlock;
      previousBlocksRef.current = blocks;
      previousProcessedContentRef.current = processedContent;
    }, [
      animateFromGlobalOffset,
      blocks,
      debugEnabled,
      nextActiveAnimationByBlock,
      plans,
      processedContent,
      rawContent.length,
      resolvedStreamAnimationDurationMs,
      windowedContent.length,
    ]);

    return (
      <div className={styles.animated}>
        {plans.map((plan) => (
          <StreamdownBlock
            {...rest}
            components={components}
            key={plan.block.id}
            remarkPlugins={remarkPluginsList}
            rehypePlugins={
              plan.block.disableAnimation
                ? rehypePluginsWithoutAnimation
                : getRehypePluginsForPlan(plan)
            }
          >
            {plan.block.raw}
          </StreamdownBlock>
        ))}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.streamAnimationDurationMs === nextProps.streamAnimationDurationMs &&
    prevProps.streamAnimationWindowMs === nextProps.streamAnimationWindowMs,
);
StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
