'use client';

import type { AnchorProps } from 'antd';
import { CSSProperties, FC, ReactNode, memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
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
import Video, { type VideoProps } from '@/mdx/mdxComponents/Video';
import type { AProps } from '@/types';

import { CodeFullFeatured, CodeLite } from './CodeBlock';
import type { TypographyProps } from './Typography';
import { useStyles as useMarkdownStyles } from './markdown.style';
import { rehypeKatexDir } from './rehypePlugin';
import { useStyles } from './style';
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from './utils';

export interface MarkdownProps extends TypographyProps {
  allowHtml?: boolean;
  children: string;
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
  enableImageGallery?: boolean;
  enableLatex?: boolean;
  enableMermaid?: boolean;
  fullFeaturedCodeBlock?: boolean;
  onDoubleClick?: () => void;
  rehypePlugins?: Pluggable[];
  remarkPlugins?: Pluggable[];
  remarkPluginsAhead?: Pluggable[];
  style?: CSSProperties;
  variant?: 'normal' | 'chat';
}

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
    componentProps,
    allowHtml,
    fontSize,
    headerMultiple,
    marginMultiple,
    variant = 'normal',
    lineHeight,
    rehypePlugins,
    remarkPlugins,
    remarkPluginsAhead,
    components = {},
    customRender,
    ...rest
  }) => {
    const { cx, styles } = useStyles({
      fontSize,
      headerMultiple,
      lineHeight,
      marginMultiple,
    });
    const { styles: mdStyles } = useMarkdownStyles({ fontSize, headerMultiple, marginMultiple });

    const isChatMode = variant === 'chat';

    const escapedContent = useMemo(() => {
      if (!enableLatex) return fixMarkdownBold(children);
      return fixMarkdownBold(escapeMhchem(escapeBrackets(children)));
    }, [children, enableLatex]);

    const memoComponents: Components = useMemo(
      () => ({
        a: (props: any) => <Link {...props} {...componentProps?.a} />,
        img: enableImageGallery
          ? (props: any) => (
              <Image
                {...props}
                {...componentProps?.img}
                style={
                  isChatMode
                    ? { height: 'auto', maxWidth: 640, ...componentProps?.img?.style }
                    : componentProps?.img?.style
                }
              />
            )
          : undefined,
        pre: (props: any) =>
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
        video: (props: any) => <Video {...props} {...componentProps?.video} />,
        ...components,
      }),
      [
        ...Object.values(components || {}),
        ...Object.values(componentProps || {}),
        enableImageGallery,
        enableMermaid,
        fullFeaturedCodeBlock,
      ],
    ) as Components;

    const innerRehypePlugins = Array.isArray(rehypePlugins) ? rehypePlugins : [rehypePlugins];

    const memoRehypePlugins = useMemo(
      () =>
        [
          allowHtml && rehypeRaw,
          enableLatex && rehypeKatex,
          enableLatex && rehypeKatexDir,
          ...innerRehypePlugins,
        ].filter(Boolean) as any,
      [allowHtml, enableLatex, ...innerRehypePlugins],
    );

    const innerRemarkPlugins = Array.isArray(remarkPlugins) ? remarkPlugins : [remarkPlugins];
    const innerRemarkPluginsAhead = Array.isArray(remarkPluginsAhead)
      ? remarkPluginsAhead
      : [remarkPluginsAhead];

    const memoRemarkPlugins = useMemo(
      () =>
        [
          ...innerRemarkPluginsAhead,
          remarkGfm,
          enableLatex && remarkMath,
          isChatMode,
          ...innerRemarkPlugins,
        ].filter(Boolean) as any,
      [isChatMode, enableLatex, ...innerRemarkPluginsAhead, ...innerRemarkPlugins],
    );

    const defaultDOM = (
      <ImageGallery enable={enableImageGallery}>
        <ReactMarkdown
          className={cx(
            mdStyles.__root,
            mdStyles.a,
            mdStyles.blockquote,
            mdStyles.code,
            mdStyles.details,
            mdStyles.header,
            mdStyles.hr,
            mdStyles.img,
            mdStyles.kbd,
            mdStyles.list,
            mdStyles.p,
            mdStyles.pre,
            mdStyles.strong,
            mdStyles.table,
            mdStyles.video,
            enableLatex && styles.latex,
            isChatMode && styles.chat,
          )}
          components={memoComponents}
          rehypePlugins={memoRehypePlugins}
          remarkPlugins={memoRemarkPlugins}
          {...rest}
        >
          {escapedContent}
        </ReactMarkdown>
      </ImageGallery>
    );

    const markdownContent = customRender
      ? customRender(defaultDOM, { text: escapedContent })
      : defaultDOM;

    return (
      <div
        className={cx(styles.root, className)}
        data-code-type="markdown"
        onDoubleClick={onDoubleClick}
        style={style}
      >
        {markdownContent}
      </div>
    );
  },
);

export default Markdown;
