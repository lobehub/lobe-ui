import {
  Collapse,
  CollapseProps,
  Divider,
  DividerProps,
  ImageProps,
  Typography,
  TypographyProps,
} from 'antd';
import { CSSProperties, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import Image from '@/Image';
import ImageGallery from '@/Image/ImageGallery';

import { CodeFullFeatured, CodeLite } from './CodeBlock';
import { useStyles } from './style';

export interface MarkdownProps {
  /**
   * @description The markdown content to be rendered
   */
  children: string;
  /**
   * @description The class name for the Markdown component
   */
  className?: string;
  componentProps?: {
    a?: TypographyProps['Link'] & HTMLAnchorElement;
    details?: CollapseProps;
    hr?: DividerProps;
    img?: ImageProps;
    pre?: any;
  };
  enableImageGallery?: boolean;
  fullFeaturedCodeBlock?: boolean;
  onDoubleClick?: () => void;
  style?: CSSProperties;
}

const MemoAlink = memo((props: any) => (
  <Typography.Link rel="noopener noreferrer" target="_blank" {...props} />
));
const MemoDetails = memo((props: any) => <Collapse {...props} />);
const MemoHr = memo((props: any) => (
  <Divider {...props} style={{ marginBottom: '1em', marginTop: 0, ...props?.style }} />
));
const MemoImage = memo((props: any) => <Image {...props} />);

const Markdown = memo<MarkdownProps>(
  ({
    children,
    className,
    style,
    fullFeaturedCodeBlock,
    onDoubleClick,
    enableImageGallery = true,
    componentProps,
    ...rest
  }) => {
    const { styles } = useStyles();
    const components: Components = {
      a: (props) => <MemoAlink {...props} {...componentProps?.a} />,
      details: (props) => <MemoDetails {...props} {...componentProps?.details} />,
      hr: (props) => <MemoHr {...props} {...componentProps?.hr} />,
      img: enableImageGallery
        ? (props) => <MemoImage {...props} {...componentProps?.img} />
        : undefined,
      pre: (props) =>
        fullFeaturedCodeBlock ? (
          <CodeFullFeatured {...props} {...componentProps?.pre} />
        ) : (
          <CodeLite {...props} {...componentProps?.pre} />
        ),
    };

    return (
      <Typography
        className={className}
        data-code-type="markdown"
        onDoubleClick={onDoubleClick}
        style={style}
      >
        <ImageGallery enable={enableImageGallery}>
          <ErrorBoundary
            fallback={
              <ReactMarkdown
                className={styles.markdown}
                components={components}
                remarkPlugins={[remarkGfm]}
                {...rest}
              >
                {children}
              </ReactMarkdown>
            }
          >
            <ReactMarkdown
              className={styles.markdown}
              components={components}
              rehypePlugins={[rehypeKatex] as any}
              remarkPlugins={[remarkGfm, remarkMath]}
              {...rest}
            >
              {children}
            </ReactMarkdown>
          </ErrorBoundary>
        </ImageGallery>
      </Typography>
    );
  },
);

export default Markdown;
