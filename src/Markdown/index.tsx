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
import { useStyles } from './style';

export interface MarkdownProps {
  allowHtml?: boolean;
  /**
   * @description The markdown content to be rendered
   */
  children: string;
  /**
   * @description The class name for the Markdown component
   */
  className?: string;
  componentProps?: {
    img?: ImageProps;
    pre?: any;
    video?: VideoProps;
  };
  enableImageGallery?: boolean;
  fontSize?: number;
  fullFeaturedCodeBlock?: boolean;
  headerMultiple?: number;

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
    variant = 'normal',
    ...rest
  }) => {
    const { cx, styles } = useStyles({ fontSize, headerMultiple: headerMultiple });

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
            className={cx(styles.markdown, variant === 'chat' && styles.chat)}
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
