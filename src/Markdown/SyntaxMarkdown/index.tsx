'use client';

import { memo, useMemo } from 'react';
import Markdown from 'react-markdown';

import { PreviewGroup } from '@/Image';
import { useMarkdown, useMarkdownContent } from '@/hooks/useMarkdown';

import { SyntaxMarkdownProps } from '../type';

// Create a pure component that only renders ReactMarkdown
// This helps prevent unnecessary rerenders of ReactMarkdown
const MarkdownRenderer = memo(
  ({
    escapedContent,
    memoComponents,
    rehypePluginsList,
    remarkPluginsList,
    reactMarkdownProps,
    enableImageGallery,
  }: {
    enableImageGallery: boolean;
    escapedContent?: string;
    memoComponents: any;
    reactMarkdownProps?: any;
    rehypePluginsList: any[];
    remarkPluginsList: any[];
  }) => {
    const content = (
      <Markdown
        {...reactMarkdownProps}
        components={memoComponents}
        rehypePlugins={rehypePluginsList}
        remarkPlugins={remarkPluginsList}
      >
        {escapedContent || ''}
      </Markdown>
    );

    if (!enableImageGallery) return content;

    return <PreviewGroup enable={enableImageGallery}>{content}</PreviewGroup>;
  },
);

MarkdownRenderer.displayName = 'MarkdownRenderer';

const SyntaxMarkdown = memo<SyntaxMarkdownProps>(
  ({
    children,
    fullFeaturedCodeBlock,
    animated,
    enableLatex = true,
    enableMermaid = true,
    enableImageGallery = true,
    enableCustomFootnotes,
    componentProps,
    allowHtml,
    showFootnotes,
    variant = 'default',
    reactMarkdownProps,
    rehypePlugins,
    remarkPlugins,
    remarkPluginsAhead,
    components = {},
    customRender,
    citations,
  }) => {
    const escapedContent = useMarkdownContent({
      animated,
      children,
      citations,
      enableCustomFootnotes,
      enableLatex,
    });

    const { memoComponents, rehypePluginsList, remarkPluginsList } = useMarkdown({
      allowHtml,
      animated,
      citations,
      componentProps,
      components,
      enableCustomFootnotes,
      enableImageGallery,
      enableLatex,
      enableMermaid,
      fullFeaturedCodeBlock,
      rehypePlugins,
      remarkPlugins,
      remarkPluginsAhead,
      showFootnotes,
      variant,
    });

    // Memoize the renderer configuration to prevent unnecessary re-renders
    const rendererProps = useMemo(
      () => ({
        enableImageGallery,
        memoComponents,
        reactMarkdownProps,
        rehypePluginsList,
        remarkPluginsList,
      }),
      [
        memoComponents,
        rehypePluginsList,
        remarkPluginsList,
        enableImageGallery,
        reactMarkdownProps,
      ],
    );

    // Render default content using memoized MarkdownRenderer
    const defaultDOM = useMemo(
      () => <MarkdownRenderer escapedContent={escapedContent} {...rendererProps} />,
      [rendererProps, escapedContent],
    );

    // Apply custom rendering if needed
    return customRender ? customRender(defaultDOM, { text: escapedContent || '' }) : defaultDOM;
  },
);

SyntaxMarkdown.displayName = 'SyntaxMarkdown';

export default SyntaxMarkdown;
