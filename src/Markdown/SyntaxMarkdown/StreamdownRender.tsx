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
import { getTagChangedMask, parseMarkdownIntoBlocks } from './blockRenderKind';
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
    const previousBlockKindsRef = useRef<string[]>([]);
    const generatedId = useId();

    const processedContent = useMemo(() => {
      const content = typeof escapedContent === 'string' ? escapedContent : '';
      return remend(content);
    }, [escapedContent]);

    const blocks = useMemo(() => parseMarkdownIntoBlocks(processedContent), [processedContent]);
    const currentBlockKinds = useMemo(() => blocks.map((block) => block.renderKind), [blocks]);
    const disableAnimationMask = useMemo(
      () => getTagChangedMask(previousBlockKindsRef.current, currentBlockKinds),
      [currentBlockKinds],
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
      previousBlockKindsRef.current = currentBlockKinds;
    }, [currentBlockKinds]);

    const blockKeys = useMemo(
      () => blocks.map((_block, index) => `${generatedId}-block_${index}`),
      [blocks, generatedId],
    );

    return (
      <div className={styles.animated}>
        {blocks.map((block, index) => (
          <StreamdownBlock
            {...rest}
            components={components}
            key={blockKeys[index]}
            remarkPlugins={remarkPluginsList}
            rehypePlugins={
              disableAnimationMask[index] ? rehypePluginsWithoutAnimation : rehypePluginsList
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
