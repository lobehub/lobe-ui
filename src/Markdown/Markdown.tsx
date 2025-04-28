'use client';

import { cva } from 'class-variance-authority';
import { memo, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown/lib';

import { PreviewGroup } from '@/Image';
import Image from '@/mdx/mdxComponents/Image';
import Link from '@/mdx/mdxComponents/Link';
import Section from '@/mdx/mdxComponents/Section';
import Video from '@/mdx/mdxComponents/Video';

import { CodeFullFeatured, CodeLite } from './CodeBlock';
import Typography from './Typography';
import { useStyles } from './style';
import type { MarkdownProps } from './type';
import {
  addToCache,
  contentCache,
  createPlugins,
  escapeBrackets,
  escapeMhchem,
  fixMarkdownBold,
  transformCitations,
} from './utils';

const Markdown = memo<MarkdownProps>(
  ({
    ref,
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
    variant = 'default',
    reactMarkdownProps,
    lineHeight = 1.6,
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

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            enableLatex: true,
            variant: 'default',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              default: null,
              chat: styles.chat,
            },
            enableLatex: {
              true: styles.latex,
              false: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

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
      (props: any) => <Image {...props} {...componentProps?.img} />,
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
      [escapedContent, memoComponents, rehypePluginsList, remarkPluginsList, enableImageGallery],
    );

    // 应用自定义渲染
    const markdownContent = customRender
      ? customRender(defaultDOM, { text: escapedContent || '' })
      : defaultDOM;

    return (
      <Typography
        className={cx(variants({ enableLatex, variant }), className)}
        data-code-type="markdown"
        fontSize={fontSize}
        headerMultiple={headerMultiple}
        lineHeight={lineHeight}
        marginMultiple={marginMultiple}
        onDoubleClick={onDoubleClick}
        ref={ref}
        style={style}
        {...rest}
      >
        {markdownContent}
      </Typography>
    );
  },
);

Markdown.displayName = 'Markdown';

export default Markdown;
