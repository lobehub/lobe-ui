'use client';

import 'katex/dist/katex.min.css';
import { marked } from 'marked';
import { memo, useId, useMemo } from 'react';
import { MarkdownHooks, Options } from 'react-markdown';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';

import { parseIncompleteMarkdown } from './parseIncompleteMarkdown';

const parseMarkdownIntoBlocks = (markdown: string): string[] => {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
};

const Block = memo(
  ({ children, ...props }: Options) => {
    const parsedContent = useMemo(
      () => (typeof children === 'string' ? parseIncompleteMarkdown(children.trim()) : children),
      [children],
    );
    return <MarkdownHooks {...props}>{parsedContent}</MarkdownHooks>;
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

export const StreamdownRender = memo(
  ({ children }: Options) => {
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
      <>
        {blocks.map((block, index) => (
          <Block
            components={components}
            key={`${generatedId}-block_${index}`}
            rehypePlugins={rehypePluginsList}
            remarkPlugins={remarkPluginsList}
          >
            {block}
          </Block>
        ))}
      </>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
