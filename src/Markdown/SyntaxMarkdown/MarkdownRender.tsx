'use client';

import { memo } from 'react';
import { MarkdownHooks, type Options } from 'react-markdown';

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
      <MarkdownHooks
        {...rest}
        components={components}
        rehypePlugins={rehypePluginsList}
        remarkPlugins={remarkPluginsList}
      >
        {escapedContent}
      </MarkdownHooks>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

export default MarkdownRenderer;
