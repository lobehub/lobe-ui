'use client';

import { ReactElement, useMemo, useRef, useState } from 'react';
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

// Define component factory types
type ComponentFactory<T = any> = (props: T) => ReactElement;
type ComponentFactories = {
  a: ComponentFactory;
  img?: ComponentFactory;
  pre: ComponentFactory;
  section: ComponentFactory;
  video: ComponentFactory;
};

/**
 * Creates reusable component factories that can be memoized once
 * and reused across multiple renders without recreation
 */
const createComponentFactories = (params: {
  animated: boolean;
  citations?: any[];
  componentProps?: any;
  enableMermaid: boolean;
  fullFeaturedCodeBlock?: boolean;
  showFootnotes?: boolean;
}): ComponentFactories => {
  const {
    citations,
    componentProps,
    animated,
    enableMermaid,
    fullFeaturedCodeBlock,
    showFootnotes,
  } = params;

  return {
    a: (props: any) => <Link citations={citations} {...props} {...componentProps?.a} />,
    img: (props: any) => <Image {...props} {...componentProps?.img} />,
    pre: (props: any) => (
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
    section: (props: any) => <Section showCitations={showFootnotes} {...props} />,
    video: (props: any) => <Video {...props} {...componentProps?.video} />,
  };
};

/**
 * Processes Markdown content and prepares rendering components and configurations
 * Optimized version with better memoization and performance
 */
export const useMarkdown = ({
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
  const isChatMode = variant === 'chat';

  // Create a memoized options object for plugin creation
  const pluginOptions = useMemo(
    () => ({
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
      animated,
      enableCustomFootnotes,
      enableLatex,
      isChatMode,
      rehypePlugins,
      remarkPlugins,
      remarkPluginsAhead,
    ],
  );

  // Create plugins with better memoization
  const { rehypePluginsList, remarkPluginsList } = useMemo(
    () => createPlugins(pluginOptions),
    [pluginOptions],
  );

  // Memoize the factory parameters to prevent recreating component factories
  const factoryParams = useMemo(
    () => ({
      animated: animated || false, // Ensure animated is always a boolean
      citations,
      componentProps,
      enableMermaid,
      fullFeaturedCodeBlock,
      showFootnotes,
    }),
    [animated, citations, componentProps, enableMermaid, fullFeaturedCodeBlock, showFootnotes],
  );

  // Create component factories once and reuse them
  const componentFactories = useMemo(
    () => createComponentFactories(factoryParams),
    [factoryParams],
  );

  // Create the final components object with proper memoization
  const memoComponents = useMemo(
    () => ({
      a: componentFactories.a,
      img: enableImageGallery ? componentFactories.img : undefined,
      pre: componentFactories.pre,
      section: componentFactories.section,
      video: componentFactories.video,
      ...components,
    }),
    [componentFactories, enableImageGallery, components],
  ) as Components;

  // Return memoized result to prevent unnecessary recalculations
  return useMemo(
    () => ({
      memoComponents,
      rehypePluginsList,
      remarkPluginsList,
    }),
    [memoComponents, rehypePluginsList, remarkPluginsList],
  );
};

export const useMarkdownContent = ({
  children,
  animated,
  enableLatex = true,
  enableCustomFootnotes,
  citations,
}: Pick<
  MarkdownProps,
  'children' | 'animated' | 'enableLatex' | 'enableCustomFootnotes' | 'citations'
>): string | undefined => {
  const [validContent, setValidContent] = useState<string>('');
  const prevProcessedContent = useRef<string>('');

  const citationsLength = citations?.length || 0;

  // Calculate cache key with fewer string concatenations and better performance
  const cacheKey = useMemo(
    () => `${children}|${enableLatex ? 1 : 0}|${enableCustomFootnotes ? 1 : 0}|${citationsLength}`,
    [children, enableLatex, enableCustomFootnotes, citationsLength],
  );

  // Process content and use cache to avoid repeated calculations
  return useMemo(() => {
    // Try to get from cache first for best performance
    if (contentCache.has(cacheKey)) {
      return contentCache.get(cacheKey);
    }

    // Process new content only if needed
    let processedContent = preprocessContent(children, {
      citationsLength,
      enableCustomFootnotes,
      enableLatex,
    });

    // Special handling for LaTeX content when animated
    if (animated && enableLatex) {
      const isRenderable = isLastFormulaRenderable(processedContent);
      if (!isRenderable && validContent) {
        processedContent = validContent;
      }
    }

    // Only update state if content changed (prevents unnecessary re-renders)
    if (processedContent !== prevProcessedContent.current) {
      setValidContent(processedContent);
      prevProcessedContent.current = processedContent;
    }

    // Cache the processed result
    addToCache(cacheKey, processedContent);
    return processedContent;
  }, [
    cacheKey,
    children,
    enableLatex,
    enableCustomFootnotes,
    citationsLength,
    animated,
    validContent,
  ]);
};
