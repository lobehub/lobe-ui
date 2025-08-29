'use client';

import { memo } from 'react';
import Markdown, { type Options } from 'react-markdown';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';

const MarkdownRenderer = memo<Options>(
  ({ children, ...rest }) => {
    const escapedContent = useMarkdownContent(children || '');
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
        {escapedContent}
      </Markdown>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

export default MarkdownRenderer;
