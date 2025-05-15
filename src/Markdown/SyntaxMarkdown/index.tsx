'use client';

import 'katex/dist/contrib/mhchem';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import { PreviewGroup } from '@/Image';
import { useMarkdown } from '@/hooks/useMarkdown';

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
    escapedContent: string;
    memoComponents: any;
    reactMarkdownProps?: any;
    rehypePluginsList: any[];
    remarkPluginsList: any[];
  }) => (
    <PreviewGroup enable={enableImageGallery}>
      <ReactMarkdown
        {...reactMarkdownProps}
        components={memoComponents}
        rehypePlugins={rehypePluginsList}
        remarkPlugins={remarkPluginsList}
      >
        {escapedContent}
      </ReactMarkdown>
    </PreviewGroup>
  ),
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
    // Use our hook to handle Markdown processing
    const { escapedContent, memoComponents, rehypePluginsList, remarkPluginsList } = useMarkdown({
      allowHtml,
      animated,
      children,
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
        escapedContent: escapedContent || '',
        memoComponents,
        reactMarkdownProps,
        rehypePluginsList,
        remarkPluginsList,
      }),
      [
        escapedContent,
        memoComponents,
        rehypePluginsList,
        remarkPluginsList,
        enableImageGallery,
        reactMarkdownProps,
      ],
    );

    // Render default content using memoized MarkdownRenderer
    const defaultDOM = useMemo(() => <MarkdownRenderer {...rendererProps} />, [rendererProps]);

    // Apply custom rendering if needed
    return customRender ? customRender(defaultDOM, { text: escapedContent || '' }) : defaultDOM;
  },
);

SyntaxMarkdown.displayName = 'SyntaxMarkdown';

export default SyntaxMarkdown;
