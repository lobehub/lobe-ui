'use client';

import { memo, useEffect, useId, useMemo, useRef } from 'react';
import Markdown, { type Options } from 'react-markdown';
import remend from 'remend';

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

const StreamdownBlock = memo<Options>(
  ({ children, ...rest }) => {
    return <Markdown {...rest}>{children}</Markdown>;
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

StreamdownBlock.displayName = 'StreamdownBlock';

export const StreamdownRender = memo<Options>(
  ({ children, ...rest }) => {
    const escapedContent = useMarkdownContent(children || '');
    const components = useMarkdownComponents();
    const rehypePluginsList = useMarkdownRehypePlugins();
    const remarkPluginsList = useMarkdownRemarkPlugins();
    const previousBlocksRef = useRef<RenderBlock[]>([]);
    const blockIdCounterRef = useRef(0);
    const generatedId = useId();

    const processedContent = useMemo(() => {
      const content = typeof escapedContent === 'string' ? escapedContent : '';
      return remend(content);
    }, [escapedContent]);

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
    const rehypePluginsWithoutAnimation = useMemo(
      () =>
        rehypePluginsList.filter((plugin) => {
          const pluginEntry = Array.isArray(plugin) ? plugin[0] : plugin;
          return pluginEntry !== rehypeStreamAnimated;
        }),
      [rehypePluginsList],
    );

    useEffect(() => {
      previousBlocksRef.current = blocks;
    }, [blocks]);

    return (
      <div className={styles.animated}>
        {blocks.map((block) => (
          <StreamdownBlock
            {...rest}
            components={components}
            key={block.id}
            remarkPlugins={remarkPluginsList}
            rehypePlugins={
              block.disableAnimation ? rehypePluginsWithoutAnimation : rehypePluginsList
            }
          >
            {block.raw}
          </StreamdownBlock>
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
