'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Components } from 'react-markdown/lib';
import type { Pluggable } from 'unified';

import { CodeBlock } from '@/Markdown/components/CodeBlock';
import type { MarkdownProps } from '@/Markdown/type';
import Image from '@/mdx/mdxComponents/Image';
import Link from '@/mdx/mdxComponents/Link';
import Section from '@/mdx/mdxComponents/Section';
import Video from '@/mdx/mdxComponents/Video';

import { isLastFormulaRenderable } from './latex';
import { addToCache, contentCache, createPlugins, preprocessContent } from './utils';

/**
 * Processes Markdown content and prepares rendering components and configurations
 */
export const useMarkdown = ({
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
  rehypePlugins,
  remarkPlugins,
  remarkPluginsAhead,
  components = {},
  citations,
}: Pick<
  MarkdownProps,
  | 'children'
  | 'fullFeaturedCodeBlock'
  | 'animated'
  | 'enableLatex'
  | 'enableMermaid'
  | 'enableImageGallery'
  | 'enableCustomFootnotes'
  | 'componentProps'
  | 'allowHtml'
  | 'showFootnotes'
  | 'variant'
  | 'rehypePlugins'
  | 'remarkPlugins'
  | 'remarkPluginsAhead'
  | 'components'
  | 'citations'
>): {
  escapedContent?: string;
  memoComponents: Components;
  rehypePluginsList: Pluggable[];
  remarkPluginsList: Pluggable[];
} => {
  const [vaildContent, setVaildContent] = useState<string>('');

  const isChatMode = variant === 'chat';

  // Calculate cache key
  const cacheKey = useMemo(() => {
    return `${children}-${enableLatex}-${enableCustomFootnotes}-${citations?.length || 0}`;
  }, [children, enableLatex, enableCustomFootnotes, citations?.length]);

  // Process content and use cache to avoid repeated calculations
  const escapedContent = useMemo(() => {
    // Try to get from cache
    if (contentCache.has(cacheKey)) {
      return contentCache.get(cacheKey);
    }

    // Process new content
    let processedContent = preprocessContent(children, {
      citationsLength: citations?.length,
      enableCustomFootnotes,
      enableLatex,
    });

    if (animated && enableLatex) {
      processedContent = isLastFormulaRenderable(processedContent)
        ? processedContent
        : vaildContent;
    }

    setVaildContent(processedContent);

    // Cache the processed result
    addToCache(cacheKey, processedContent);
    return processedContent;
  }, [
    vaildContent,
    cacheKey,
    children,
    enableLatex,
    enableCustomFootnotes,
    citations?.length,
    animated,
  ]);

  // Create plugins
  const { rehypePluginsList, remarkPluginsList } = useMemo(
    () =>
      createPlugins({
        allowHtml,
        animated,
        enableCustomFootnotes,
        enableLatex,
        isChatMode,
        rehypePlugins,
        remarkPlugins,
        remarkPluginsAhead,
      }),
    [
      allowHtml,
      enableLatex,
      enableCustomFootnotes,
      isChatMode,
      rehypePlugins,
      remarkPlugins,
      remarkPluginsAhead,
      animated,
    ],
  );

  // Use useCallback to optimize rendering subcomponents
  const renderLink = useCallback(
    (props: any) => <Link citations={citations} {...props} {...componentProps?.a} />,
    [citations],
  );

  const renderImage = useCallback(
    (props: any) => <Image {...props} {...componentProps?.img} />,
    [],
  );

  const renderCodeBlock = useCallback(
    (props: any) => (
      <CodeBlock
        animated={animated}
        enableMermaid={enableMermaid}
        fullFeatured={fullFeaturedCodeBlock}
        highlight={componentProps?.highlight}
        mermaid={componentProps?.mermaid}
        {...componentProps?.pre}
        {...props}
      />
    ),
    [animated, enableMermaid, fullFeaturedCodeBlock],
  );

  const renderSection = useCallback(
    (props: any) => <Section showCitations={showFootnotes} {...props} />,
    [showFootnotes],
  );

  const renderVideo = useCallback(
    (props: any) => <Video {...props} {...componentProps?.video} />,
    [],
  );

  // Create component mapping
  const memoComponents = useMemo(
    () => ({
      a: renderLink,
      img: enableImageGallery ? renderImage : undefined,
      pre: renderCodeBlock,
      section: renderSection,
      video: renderVideo,
      ...components,
    }),
    [
      renderLink,
      renderImage,
      renderCodeBlock,
      renderSection,
      renderVideo,
      enableImageGallery,
      components,
      componentProps,
    ],
  ) as Components;

  return useMemo(
    () => ({
      escapedContent,
      memoComponents,
      rehypePluginsList,
      remarkPluginsList,
    }),
    [animated, escapedContent, memoComponents, rehypePluginsList, remarkPluginsList],
  );
};
