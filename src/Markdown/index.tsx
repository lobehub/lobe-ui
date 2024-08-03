'use client';

import type { AnchorProps } from 'antd';
import { CSSProperties, memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import ImageGallery from '@/Image/ImageGallery';
import Image, { type ImageProps } from '@/mdx/Image';
import Link from '@/mdx/Link';
import type { PreProps } from '@/mdx/Pre';
import Video, { type VideoProps } from '@/mdx/Video';
import type { AProps } from '@/types';

import { CodeFullFeatured, CodeLite } from './CodeBlock';
import type { TypographyProps } from './Typography';
import { useStyles as useMarkdownStyles } from './markdown.style';
import { useStyles } from './style';
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from './utils';

export interface MarkdownProps extends TypographyProps {
  allowHtml?: boolean;
  children: string;
  className?: string;
  componentProps?: {
    a?: Partial<AProps & AnchorProps>;
    img?: Partial<ImageProps>;
    pre?: Partial<PreProps>;
    video?: Partial<VideoProps>;
  };
  enableImageGallery?: boolean;
  enableLatex?: boolean;
  fullFeaturedCodeBlock?: boolean;
  onDoubleClick?: () => void;
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
    enableImageGallery = true,
    componentProps,
    allowHtml,
    fontSize,
    headerMultiple,
    marginMultiple,
    variant = 'normal',
    lineHeight,
    ...rest
  }) => {
    const { cx, styles } = useStyles({ fontSize, headerMultiple, lineHeight, marginMultiple });
    const { styles: mdStyles } = useMarkdownStyles({ fontSize, headerMultiple, marginMultiple });
    const isChatMode = variant === 'chat';

    const escapedContent = useMemo(() => {
      if (!enableLatex) return children;
      return fixMarkdownBold(escapeMhchem(escapeBrackets(children)));
    }, [children, enableLatex]);
    
    const escapedContent = useMemo(() => {
      if (!enableLatex) return children;
      return escapeMhchem(escapeBrackets(children));
    }, [children, enableLatex]);

    const components: Components = useMemo(
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
            <CodeFullFeatured {...props} {...componentProps?.pre} />
          ) : (
            <CodeLite {...props} {...componentProps?.pre} />
          ),
        video: (props: any) => <Video {...props} {...componentProps?.video} />,
      }),
      [componentProps, enableImageGallery, fullFeaturedCodeBlock],
    );

    const rehypePlugins = useMemo(
      () => [allowHtml && rehypeRaw, enableLatex && rehypeKatex].filter(Boolean) as any,
      [allowHtml],
    );
    const remarkPlugins = useMemo(
      () =>
        [remarkGfm, enableLatex && remarkMath, isChatMode && remarkBreaks].filter(Boolean) as any,
      [isChatMode],
    );

    return (
      <article
        className={cx(styles.root, className)}
        data-code-type="markdown"
        onDoubleClick={onDoubleClick}
        style={style}
      >
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
              isChatMode && styles.chat,
            )}
            components={components}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            {...rest}
          >
            {escapedContent}
          </ReactMarkdown>
        </ImageGallery>
      </article>
    );
  },
);

export default Markdown;
