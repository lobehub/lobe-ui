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
  streamAnimationWindowMs?: number;
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

    const getRehypePluginsForBlock = (block: RenderBlock): Pluggable[] => {
      const animateFromSourceOffset = Math.min(
        Math.max(animateFromGlobalOffset - block.startOffset, 0),
        block.raw.length,
      );

      return rehypePluginsList.map((plugin): Pluggable => {
        const pluginEntry = Array.isArray(plugin) ? plugin[0] : plugin;
        if (pluginEntry !== rehypeStreamAnimated) return plugin;

        return [rehypeStreamAnimated, { animateFromSourceOffset }] as unknown as Pluggable;
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
          blocks.map((block) => {
            const localOffset = Math.min(
              Math.max(animateFromGlobalOffset - block.startOffset, 0),
              block.raw.length,
            );

            return {
              disableAnimation: block.disableAnimation,
              end: block.endOffset,
              id: block.id,
              localOffset,
              rawLength: block.raw.length,
              renderKind: block.renderKind,
              sample: block.raw.slice(0, 64).replaceAll('\n', '\\n'),
              start: block.startOffset,
            };
          }),
        );
        console.groupEnd();
      }

      previousBlocksRef.current = blocks;
      previousProcessedContentRef.current = processedContent;
    }, [
      animateFromGlobalOffset,
      blocks,
      debugEnabled,
      processedContent,
      rawContent.length,
      windowedContent.length,
    ]);

    return (
      <div className={styles.animated}>
        {blocks.map((block) => (
          <StreamdownBlock
            {...rest}
            components={components}
            key={block.id}
            remarkPlugins={remarkPluginsList}
            rehypePlugins={
              block.disableAnimation
                ? rehypePluginsWithoutAnimation
                : getRehypePluginsForBlock(block)
            }
          >
            {block.raw}
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
