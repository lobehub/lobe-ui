'use client';

import { marked } from 'marked';
import { memo, useId, useMemo } from 'react';
import Markdown, { Options } from 'react-markdown';

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
    const blocks = useMemo(
      () => parseMarkdownIntoBlocks(typeof escapedContent === 'string' ? escapedContent : ''),
      [escapedContent],
    );

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
