'use client';

import type { AnchorProps } from 'antd';
import { CSSProperties, FC, ReactNode, memo, useCallback, useMemo } from 'react';
import ReactMarkdown, { Options as ReactMarkdownOptions } from 'react-markdown';
import { Components } from 'react-markdown/lib';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { Pluggable } from 'unified';

import { type HighlighterProps } from '@/Highlighter';
import ImageGallery from '@/Image/ImageGallery';
import { type MermaidProps } from '@/Mermaid';
import Image, { type ImageProps } from '@/mdx/mdxComponents/Image';
import Link from '@/mdx/mdxComponents/Link';
import { type PreProps } from '@/mdx/mdxComponents/Pre';
import Section from '@/mdx/mdxComponents/Section';
import Video, { type VideoProps } from '@/mdx/mdxComponents/Video';
import type { AProps } from '@/types';
import { CitationItem } from '@/types/citation';

import { CodeFullFeatured, CodeLite } from './CodeBlock';
import Typography, { type TypographyProps } from './Typography';
import { rehypeFootnoteLinks, remarkCustomFootnotes } from './plugins/footnote';
import { rehypeKatexDir } from './plugins/katexDir';
import { useStyles } from './style';
import { escapeBrackets, escapeMhchem, fixMarkdownBold, transformCitations } from './utils';

// 使用普通 Map 代替 WeakMap，并限制缓存大小
const CACHE_SIZE = 50;
const contentCache = new Map<string, string>();

// 添加内容到缓存时，保持缓存大小不超过限制
const addToCache = (key: string, value: string) => {
  if (contentCache.size >= CACHE_SIZE) {
    // 移除最早加入的缓存项
    const firstKey = contentCache.keys().next().value;
    if (firstKey) contentCache.delete(firstKey);
  }
  contentCache.set(key, value);
};

export interface MarkdownProps extends TypographyProps {
  allowHtml?: boolean;
  children: string;
  citations?: CitationItem[];
  className?: string;
  componentProps?: {
    a?: Partial<AProps & AnchorProps>;
    highlight?: Partial<HighlighterProps>;
    img?: Partial<ImageProps>;
    mermaid?: Partial<MermaidProps>;
    pre?: Partial<PreProps>;
    video?: Partial<VideoProps>;
  };
  components?: Components & Record<string, FC>;
  customRender?: (dom: ReactNode, context: { text: string }) => ReactNode;
  enableCustomFootnotes?: boolean;
  enableImageGallery?: boolean;
  enableLatex?: boolean;
  enableMermaid?: boolean;
  fullFeaturedCodeBlock?: boolean;
  onDoubleClick?: () => void;
  reactMarkdownProps?: Omit<
    Readonly<ReactMarkdownOptions>,
    'components' | 'rehypePlugins' | 'remarkPlugins'
  >;
  rehypePlugins?: Pluggable[];
  remarkPlugins?: Pluggable[];
  remarkPluginsAhead?: Pluggable[];
  showFootnotes?: boolean;
  style?: CSSProperties;
  variant?: 'normal' | 'chat';
}

// 使用工厂函数处理插件，减少组件中的逻辑负担
const createPlugins = (props: {
  allowHtml?: boolean;
  enableCustomFootnotes?: boolean;
  enableLatex?: boolean;
  isChatMode: boolean;
  rehypePlugins?: Pluggable | Pluggable[];
  remarkPlugins?: Pluggable | Pluggable[];
  remarkPluginsAhead?: Pluggable | Pluggable[];
}) => {
  const {
    allowHtml,
    enableLatex,
    enableCustomFootnotes,
    isChatMode,
    rehypePlugins,
    remarkPlugins,
    remarkPluginsAhead,
  } = props;

  // 预处理插件数组
  const normalizedRehypePlugins = Array.isArray(rehypePlugins)
    ? rehypePlugins
    : rehypePlugins
      ? [rehypePlugins]
      : [];

  const normalizedRemarkPlugins = Array.isArray(remarkPlugins)
    ? remarkPlugins
    : remarkPlugins
      ? [remarkPlugins]
      : [];

  const normalizedRemarkPluginsAhead = Array.isArray(remarkPluginsAhead)
    ? remarkPluginsAhead
    : remarkPluginsAhead
      ? [remarkPluginsAhead]
      : [];

  // 创建 rehype 插件列表
  const rehypePluginsList = [
    allowHtml && rehypeRaw,
    enableLatex && rehypeKatex,
    enableLatex && rehypeKatexDir,
    enableCustomFootnotes && rehypeFootnoteLinks,
    ...normalizedRehypePlugins,
  ].filter(Boolean) as Pluggable[];

  // 创建 remark 插件列表
  const remarkPluginsList = [
    ...normalizedRemarkPluginsAhead,
    [remarkGfm, { singleTilde: false }],
    enableCustomFootnotes && remarkCustomFootnotes,
    enableLatex && remarkMath,
    isChatMode && remarkBreaks,
    ...normalizedRemarkPlugins,
  ].filter(Boolean) as Pluggable[];

  return {
    rehypePluginsList,
    remarkPluginsList,
  };
};

const Markdown = memo<MarkdownProps>(
  ({
    children,
    className,
    style,
    fullFeaturedCodeBlock,
    onDoubleClick,
    enableLatex = true,
    enableMermaid = true,
    enableImageGallery = true,
    enableCustomFootnotes,
    componentProps,
    allowHtml,
    fontSize = 14,
    headerMultiple = 0.25,
    marginMultiple = 1,
    showFootnotes,
    variant = 'normal',
    lineHeight = 1.6,
    reactMarkdownProps = {},
    rehypePlugins,
    remarkPlugins,
    remarkPluginsAhead,
    components = {},
    customRender,
    citations,
    ...rest
  }) => {
    const { cx, styles } = useStyles();
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
        processedContent = enableCustomFootnotes
          ? transformCitations(baseContent, citations?.length)
          : baseContent;
      } else {
        processedContent = fixMarkdownBold(children);
      }

      // 缓存处理结果
      addToCache(cacheKey, processedContent);
      return processedContent;
    }, [cacheKey, children, enableLatex, enableCustomFootnotes, citations?.length]);

    // 创建插件
    const { rehypePluginsList, remarkPluginsList } = useMemo(
      () =>
        createPlugins({
          allowHtml,
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
      ],
    );

    // 使用 useCallback 优化渲染子组件
    const renderLink = useCallback(
      (props: any) => <Link citations={citations} {...props} {...componentProps?.a} />,
      [citations, componentProps?.a],
    );

    const renderImage = useCallback(
      (props: any) => (
        <Image
          {...props}
          {...componentProps?.img}
          style={
            isChatMode
              ? { height: 'auto', maxWidth: 640, ...componentProps?.img?.style }
              : componentProps?.img?.style
          }
        />
      ),
      [isChatMode, componentProps?.img],
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

    // 渲染默认内容
    const defaultDOM = useMemo(
      () => (
        <ImageGallery enable={enableImageGallery}>
          <ReactMarkdown
            {...reactMarkdownProps}
            components={memoComponents}
            rehypePlugins={rehypePluginsList}
            remarkPlugins={remarkPluginsList}
          >
            {escapedContent}
          </ReactMarkdown>
        </ImageGallery>
      ),
      [escapedContent, memoComponents, rehypePluginsList, remarkPluginsList, enableImageGallery],
    );

    // 应用自定义渲染
    const markdownContent = customRender
      ? customRender(defaultDOM, { text: escapedContent || '' })
      : defaultDOM;

    return (
      <Typography
        className={cx(
          styles.root,
          enableLatex && styles.latex,
          isChatMode && styles.chat,
          className,
        )}
        data-code-type="markdown"
        fontSize={fontSize}
        headerMultiple={headerMultiple}
        lineHeight={lineHeight}
        marginMultiple={marginMultiple}
        onDoubleClick={onDoubleClick}
        style={style}
        {...rest}
      >
        {markdownContent}
      </Typography>
    );
  },
);

export default Markdown;
