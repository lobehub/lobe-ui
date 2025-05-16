'use client';

import { memo } from 'react';
import Markdown, { type Options as ReactMarkdownOptions } from 'react-markdown';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';

const MarkdownRenderer = memo<ReactMarkdownOptions>(({ children, ...rest }) => {
  const components = useMarkdownComponents();
  const rehypePluginsList = useMarkdownRehypePlugins();
  const remarkPluginsList = useMarkdownRemarkPlugins();
  return (
    <Markdown
      {...rest}
      components={components}
      rehypePlugins={rehypePluginsList}
      remarkPlugins={remarkPluginsList}
    >
      {children}
    </Markdown>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

const SyntaxMarkdown = memo<ReactMarkdownOptions>(({ children, ...rest }) => {
  const escapedContent = useMarkdownContent(children || '');
  return <MarkdownRenderer {...rest}>{escapedContent}</MarkdownRenderer>;
});

SyntaxMarkdown.displayName = 'SyntaxMarkdown';

export default SyntaxMarkdown;
