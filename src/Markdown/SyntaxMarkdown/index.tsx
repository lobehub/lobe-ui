'use client';

import 'katex/dist/contrib/mhchem';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import { PreviewGroup } from '@/Image';
import { useMarkdown } from '@/hooks/useMarkdown';

import { SyntaxMarkdownProps } from '../type';

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
    // Use our new hook to handle Markdown processing
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

    // Render default content
    const defaultDOM = useMemo(
      () => (
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
      [
        escapedContent,
        memoComponents,
        rehypePluginsList,
        remarkPluginsList,
        enableImageGallery,
        reactMarkdownProps,
      ],
    );

    // Apply custom rendering
    const markdownContent = customRender
      ? customRender(defaultDOM, { text: escapedContent || '' })
      : defaultDOM;

    return markdownContent;
  },
);

SyntaxMarkdown.displayName = 'SyntaxMarkdown';

export default SyntaxMarkdown;
