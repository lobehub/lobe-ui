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
import { countStreamAnimationChars } from '../streamTokens';
import { parseMarkdownIntoBlocks, type RenderBlock } from './blockRenderKind';
import { reconcileBlocks } from './reconcileBlocks';
import { styles } from './style';
import { useWindowedStreamContent } from './useWindowedStreamContent';

interface StreamdownRenderProps extends Options {
  streamAnimationWindowMs?: number;
}

interface BlockAnimationRange extends StreamAnimateRange {}

interface BlockAnimationState extends BlockAnimationRange {}

interface BlockRenderPlan {
  block: RenderBlock;
  localOffset: number;
  ranges: BlockAnimationRange[];
}

const STREAM_DEBUG_FLAG = '__LOBE_MARKDOWN_STREAM_DEBUG__';
const MAX_STAGGER_SPAN_RATIO = 0.9;
const MAX_TOKEN_DELAY_STEP_MS = 72;

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
    const processedContent = useMemo(() => {
      return remend(windowedContent);
    }, [windowedContent]);
    const maxTokenStaggerSpanMs = Math.max(
      30,
      Math.round(streamAnimationWindowMs * MAX_STAGGER_SPAN_RATIO),
    );

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
      const nextRanges = new Map<string, BlockAnimationState>();
      const previousRanges = activeAnimationByBlockRef.current;
      const nextPlans: BlockRenderPlan[] = [];
      const localOffsets = blocks.map((block) =>
        Math.min(Math.max(animateFromGlobalOffset - block.startOffset, 0), block.raw.length),
      );
      let latestAnimatedBlockIndex = -1;

      for (let index = blocks.length - 1; index >= 0; index -= 1) {
        const block = blocks[index];
        if (block.disableAnimation) continue;

        const localOffset = localOffsets[index];
        if (localOffset >= block.raw.length) continue;

        const incomingText = block.raw.slice(localOffset);
        if (!incomingText.trim()) continue;

        latestAnimatedBlockIndex = index;
        break;
      }

      for (const [index, block] of blocks.entries()) {
        const localOffset = localOffsets[index];
        const previousRange = previousRanges.get(block.id);
        let latestRange: BlockAnimationRange | undefined;
        const shouldAnimateBlock = !block.disableAnimation && latestAnimatedBlockIndex === index;

        if (shouldAnimateBlock && localOffset < block.raw.length) {
          const nextStart = localOffset;
          const nextEnd = block.raw.length;
          const shouldReusePreviousRange =
            !!previousRange && previousRange.start === nextStart && previousRange.end === nextEnd;

          latestRange = shouldReusePreviousRange
            ? previousRange
            : {
                end: nextEnd,
                key: `${block.id}-range-${nextStart}-${nextEnd}`,
                start: nextStart,
              };
        }

        if (latestRange) {
          nextRanges.set(block.id, latestRange);
        }

        const ranges: BlockAnimationRange[] = [];
        if (latestRange) {
          const rangeText = block.raw.slice(latestRange.start, latestRange.end);
          const tokenCount = countStreamAnimationChars(rangeText);
          const baseStep = tokenCount > 1 ? streamAnimationWindowMs / tokenCount : 0;
          const maxStepBySpan = tokenCount > 1 ? maxTokenStaggerSpanMs / (tokenCount - 1) : 0;
          const tokenDelayStepMs =
            tokenCount <= 1 ? 0 : Math.min(MAX_TOKEN_DELAY_STEP_MS, baseStep, maxStepBySpan);
          ranges.push({
            ...latestRange,
            tokenDelayStartMs: 0,
            tokenDelayStepMs,
          });
        }
        nextPlans.push({
          block,
          localOffset,
          ranges,
        });
      }

      return { nextActiveAnimationByBlock: nextRanges, plans: nextPlans };
    }, [animateFromGlobalOffset, blocks, maxTokenStaggerSpanMs, streamAnimationWindowMs]);

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
