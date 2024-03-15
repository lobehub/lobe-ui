import { CSSProperties, memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import Image, { type ImageProps } from '@/Image';
import ImageGallery from '@/Image/ImageGallery';
import Video, { type VideoProps } from '@/Video';

import { CodeFullFeatured, CodeLite } from './CodeBlock';
import type { TypographyProps } from './Typography';
import { useStyles as useMarkdownStyles } from './markdown.style';
import { useStyles } from './style';

export interface MarkdownProps extends TypographyProps {
  allowHtml?: boolean;
  children: string;
  className?: string;
  componentProps?: {
    img?: ImageProps;
    pre?: any;
    video?: VideoProps;
  };
  enableImageGallery?: boolean;
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
    enableImageGallery = true,
    componentProps,
    allowHtml,
    fontSize,
    headerMultiple,
    marginMultiple,
    variant = 'normal',
    ...rest
  }) => {
    const { cx, styles } = useStyles({ fontSize, headerMultiple, marginMultiple });
    const { styles: mdStyles } = useMarkdownStyles({ fontSize, headerMultiple, marginMultiple });

    const components: Components = useMemo(
      () => ({
        img: enableImageGallery
          ? (props: any) => <Image {...props} {...componentProps?.img} />
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
      () => [allowHtml && rehypeRaw, rehypeKatex].filter(Boolean) as any,
      [allowHtml],
    );
    const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);

    return (
      <article
        className={className}
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
              variant === 'chat' && styles.chat,
            )}
            components={components}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            {...rest}
          >
            {children}
          </ReactMarkdown>
        </ImageGallery>
      </article>
    );
  },
);

export default Markdown;
