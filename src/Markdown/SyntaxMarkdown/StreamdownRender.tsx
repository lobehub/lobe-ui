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

import { rehypeStreamAnimated, type StreamAnimateRange } from '../plugins/rehypeStreamAnimated';
import { countStreamAnimationTokens } from '../streamTokens';
import { parseMarkdownIntoBlocks, type RenderBlock } from './blockRenderKind';
import { reconcileBlocks } from './reconcileBlocks';
import { styles } from './style';
import { useWindowedStreamContent } from './useWindowedStreamContent';

interface StreamdownRenderProps extends Options {
  streamAnimationWindowMs?: number;
}

interface BlockAnimationRange extends StreamAnimateRange {}

interface BlockAnimationState extends BlockAnimationRange {
  phase: number;
}

interface BlockRenderPlan {
  block: RenderBlock;
  localOffset: number;
  ranges: BlockAnimationRange[];
}

const STREAM_DEBUG_FLAG = '__LOBE_MARKDOWN_STREAM_DEBUG__';
const SECOND_STAGE_DELAY_RATIO = 0.25;
const MIN_TOKEN_DELAY_STEP_MS = 4;
const MAX_TOKEN_DELAY_STEP_MS = 36;

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

const StreamdownBlock = memo<Options>(
  ({ children, ...rest }) => {
    return <Markdown {...rest}>{children}</Markdown>;
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

StreamdownBlock.displayName = 'StreamdownBlock';

export const StreamdownRender = memo<StreamdownRenderProps>(
  ({ children, streamAnimationWindowMs = 200, ...rest }: StreamdownRenderProps) => {
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
    const renderPhaseRef = useRef(0);
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
      const phase = renderPhaseRef.current + 1;
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
        if (
          previousRange &&
          previousRange.phase === phase - 1 &&
          previousRange.start < previousRange.end
        ) {
          ranges.push(previousRange);
        }

        let latestRange = previousRange;
        if (!block.disableAnimation && localOffset < block.raw.length) {
          const nextStart = localOffset;
          const nextEnd = block.raw.length;
          const shouldReusePreviousRange =
            !!previousRange && previousRange.start === nextStart && previousRange.end === nextEnd;

          if (!shouldReusePreviousRange) {
            latestRange = {
              end: nextEnd,
              key: `${block.id}-range-${nextStart}-${nextEnd}`,
              phase,
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
          nextRanges.set(block.id, {
            ...latestRange,
            phase,
          });
        }

        ranges.sort((left, right) => left.start - right.start);
        const stageDelayStartMs = Math.max(
          0,
          Math.round(streamAnimationWindowMs * SECOND_STAGE_DELAY_RATIO),
        );
        const rangesWithDelay = ranges.map((range, rangeIndex) => {
          const rangeText = block.raw.slice(range.start, range.end);
          const tokenCount = countStreamAnimationTokens(rangeText);
          const baseStep = tokenCount > 0 ? streamAnimationWindowMs / tokenCount : 0;
          const tokenDelayStepMs =
            tokenCount <= 1
              ? 0
              : Math.min(MAX_TOKEN_DELAY_STEP_MS, Math.max(MIN_TOKEN_DELAY_STEP_MS, baseStep));

          return {
            ...range,
            tokenDelayStartMs: rangeIndex * stageDelayStartMs,
            tokenDelayStepMs,
          };
        });
        nextPlans.push({
          block,
          localOffset,
          ranges: rangesWithDelay,
        });
      }

      return { nextActiveAnimationByBlock: nextRanges, plans: nextPlans };
    }, [animateFromGlobalOffset, blocks, streamAnimationWindowMs]);

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
          },
        ] as unknown as Pluggable;
      });
    };

    useEffect(() => {
      if (debugEnabled) {
        const debugIndex = debugRenderCountRef.current;
        debugRenderCountRef.current += 1;

        console.groupCollapsed(
          `[StreamdownRender] #${debugIndex} prev=${previousProcessedContentRef.current?.length ?? 0} curr=${processedContent.length} global=${animateFromGlobalOffset} raw=${rawContent.length} windowed=${windowedContent.length}`,
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
              ranges: plan.ranges
                .map(
                  (range) =>
                    `${range.start}-${range.end}|d0=${range.tokenDelayStartMs ?? 0}|ds=${range.tokenDelayStepMs ?? 0}`,
                )
                .join(','),
              renderKind: block.renderKind,
              sample: block.raw.slice(0, 64).replaceAll('\n', '\\n'),
              start: block.startOffset,
            };
          }),
        );
        console.groupEnd();
      }

      activeAnimationByBlockRef.current = nextActiveAnimationByBlock;
      renderPhaseRef.current += 1;
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
    prevProps.streamAnimationWindowMs === nextProps.streamAnimationWindowMs,
);
StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
