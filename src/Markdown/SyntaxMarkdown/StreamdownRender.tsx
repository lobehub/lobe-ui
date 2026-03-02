'use client';

import { marked } from 'marked';
import { memo, useId, useMemo } from 'react';
import Markdown, { type Options } from 'react-markdown';
import remend from 'remend';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';

import { styles } from './style';

const parseMarkdownIntoBlocks = (markdown: string): string[] => {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
};

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
    const generatedId = useId();
    const processedContent = useMemo(() => {
      const content = typeof escapedContent === 'string' ? escapedContent : '';
      return remend(content);
    }, [escapedContent]);

    const blocks = useMemo(() => parseMarkdownIntoBlocks(processedContent), [processedContent]);

    return (
      <div className={styles.animated}>
        {blocks.map((block, index) => (
          <StreamdownBlock
            {...rest}
            components={components}
            key={`${generatedId}-block_${index}`}
            rehypePlugins={rehypePluginsList}
            remarkPlugins={remarkPluginsList}
          >
            {block}
          </StreamdownBlock>
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
