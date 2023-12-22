import { Collapse, Divider, Typography } from 'antd';
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
  enableImageGallery?: boolean;
  fullFeaturedCodeBlock?: boolean;
  onDoubleClick?: () => void;
  style?: CSSProperties;
}

const MemoAlink = memo((props: any) => (
  <Typography.Link {...props} rel="noopener noreferrer" target="_blank" />
));
const MemoDetails = memo((props: any) => <Collapse {...props} />);
const MemoHr = memo(() => <Divider style={{ marginBottom: '1em', marginTop: 0 }} />);
const MemoImage = memo((props: any) => <Image {...props} />);

const Markdown = memo<MarkdownProps>(
  ({
    children,
    className,
    style,
    fullFeaturedCodeBlock,
    onDoubleClick,
    enableImageGallery = true,
    ...rest
  }) => {
    const { styles } = useStyles();
    const components: Components = {
      a: MemoAlink,
      details: MemoDetails,
      hr: MemoHr,
      img: enableImageGallery ? MemoImage : undefined,
      pre: fullFeaturedCodeBlock ? CodeFullFeatured : CodeLite,
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
