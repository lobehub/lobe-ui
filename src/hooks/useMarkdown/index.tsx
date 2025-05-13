'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Components } from 'react-markdown/lib';
import type { Pluggable } from 'unified';

import { CodeFullFeatured, CodeLite } from '@/Markdown/components/CodeBlock';
import type { MarkdownProps } from '@/Markdown/type';
import Image from '@/mdx/mdxComponents/Image';
import Link from '@/mdx/mdxComponents/Link';
import Section from '@/mdx/mdxComponents/Section';
import Video from '@/mdx/mdxComponents/Video';

import {
  addToCache,
  areFormulasRenderable,
  contentCache,
  createPlugins,
  escapeBrackets,
  escapeMhchem,
  fixMarkdownBold,
  transformCitations,
} from './utils';

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

  // 计算缓存键
  const cacheKey = useMemo(() => {
    return `${children}-${enableLatex}-${enableCustomFootnotes}-${citations?.length || 0}`;
  }, [children, enableLatex, enableCustomFootnotes, citations?.length]);

  // 处理内容并利用缓存避免重复计算
  const escapedContent = useMemo(() => {
    // 尝试从缓存获取
    if (contentCache.has(cacheKey)) {
      return contentCache.get(cacheKey);
    }

    // 处理新内容
    let processedContent;
    if (enableLatex) {
      const baseContent = fixMarkdownBold(escapeMhchem(escapeBrackets(children)));
      const tempContent = enableCustomFootnotes
        ? transformCitations(baseContent, citations?.length)
        : baseContent;
      processedContent = areFormulasRenderable(tempContent) ? tempContent : vaildContent;
    } else {
      processedContent = fixMarkdownBold(children);
    }

    setVaildContent(processedContent);

    // 缓存处理结果
    addToCache(cacheKey, processedContent);
    return processedContent;
  }, [vaildContent, cacheKey, children, enableLatex, enableCustomFootnotes, citations?.length]);

  // 创建插件
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

  // 使用 useCallback 优化渲染子组件
  const renderLink = useCallback(
    (props: any) => <Link citations={citations} {...props} {...componentProps?.a} />,
    [citations, componentProps?.a],
  );

  const renderImage = useCallback(
    (props: any) => <Image {...props} {...componentProps?.img} />,
    [componentProps?.img],
  );

  const renderCodeBlock = useCallback(
    (props: any) =>
      fullFeaturedCodeBlock ? (
        <CodeFullFeatured
          enableMermaid={enableMermaid}
          highlight={componentProps?.highlight}
          mermaid={componentProps?.mermaid}
          {...props}
          {...componentProps?.pre}
        />
      ) : (
        <CodeLite
          enableMermaid={enableMermaid}
          highlight={componentProps?.highlight}
          mermaid={componentProps?.mermaid}
          {...props}
          {...componentProps?.pre}
        />
      ),
    [
      enableMermaid,
      fullFeaturedCodeBlock,
      componentProps?.highlight,
      componentProps?.mermaid,
      componentProps?.pre,
    ],
  );

  const renderSection = useCallback(
    (props: any) => <Section showCitations={showFootnotes} {...props} />,
    [showFootnotes],
  );

  const renderVideo = useCallback(
    (props: any) => <Video {...props} {...componentProps?.video} />,
    [componentProps?.video],
  );

  // 创建组件映射
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
    ],
  ) as Components;

  return useMemo(
    () => ({
      escapedContent,
      memoComponents,
      rehypePluginsList,
      remarkPluginsList,
    }),
    [escapedContent, memoComponents, rehypePluginsList, remarkPluginsList],
  );
};
