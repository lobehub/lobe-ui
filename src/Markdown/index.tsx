import { Collapse, Divider, Image, Typography } from 'antd';
import { CSSProperties, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Flexbox } from 'react-layout-kit';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

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
  fullFeaturedCodeBlock?: boolean;
  onDoubleClick?: () => void;
  style?: CSSProperties;
}

const Markdown = memo<MarkdownProps>(
  ({ children, className, style, fullFeaturedCodeBlock, onDoubleClick, ...rest }) => {
    const { styles } = useStyles();
    const components: Components = {
      a: (props: any) => <Typography.Link {...props} rel="noopener noreferrer" target="_blank" />,
      details: (props: any) => <Collapse {...props} />,
      hr: () => <Divider style={{ marginBottom: '1em', marginTop: 0 }} />,
      img: (props: any) => (
        <Flexbox className={styles.imageWrapper}>
          <Image
            preview={{
              styles: { mask: { backdropFilter: 'blur(2px)' } },
            }}
            wrapperClassName={styles.image}
            {...props}
          />
        </Flexbox>
      ),
      pre: fullFeaturedCodeBlock ? CodeFullFeatured : CodeLite,
    };

    return (
      <Typography className={className} onDoubleClick={onDoubleClick} style={style}>
        <Image.PreviewGroup
          preview={{
            styles: { mask: { backdropFilter: 'blur(2px)' } },
          }}
        >
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
              rehypePlugins={[rehypeKatex]}
              remarkPlugins={[remarkGfm, remarkMath]}
              {...rest}
            >
              {children}
            </ReactMarkdown>
          </ErrorBoundary>
        </Image.PreviewGroup>
      </Typography>
    );
  },
);

export default Markdown;
