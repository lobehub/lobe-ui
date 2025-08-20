'use client';

import { Skeleton } from 'antd';
import { marked } from 'marked';
import { memo, useId, useMemo } from 'react';
import { MarkdownHooks, type Options as ReactMarkdownOptions } from 'react-markdown';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';

export const MarkdownRenderer = memo<ReactMarkdownOptions>(
  ({ children, ...rest }) => {
    const escapedContent = useMarkdownContent(children || '');
    const components = useMarkdownComponents();
    const rehypePluginsList = useMarkdownRehypePlugins();
    const remarkPluginsList = useMarkdownRemarkPlugins();

    return (
      <MarkdownHooks
        {...rest}
        components={components}
        fallback={<Skeleton paragraph={{ rows: 1 }} title={false} />}
        rehypePlugins={rehypePluginsList}
        remarkPlugins={remarkPluginsList}
      >
        {escapedContent}
      </MarkdownHooks>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

MarkdownRenderer.displayName = 'MarkdownRenderer';

const parseMarkdownIntoBlocks = (markdown: string): string[] => {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
};

export const StreamdownRender = memo<ReactMarkdownOptions>(
  ({ children, ...rest }) => {
    const generatedId = useId();
    const blocks = useMemo(
      () => parseMarkdownIntoBlocks(typeof children === 'string' ? children : ''),
      [children],
    );

    return blocks.map((block, index) => (
      <MarkdownRenderer key={`${generatedId}-block_${index}`} {...rest}>
        {block}
      </MarkdownRenderer>
    ));
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

StreamdownRender.displayName = 'StreamdownRender';
