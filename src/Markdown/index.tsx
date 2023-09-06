import { Collapse, Divider, Image, Typography } from 'antd';
import 'katex/dist/katex.min.css';
import { CSSProperties, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
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
  style?: CSSProperties;
}

const Markdown = memo<MarkdownProps>(
  ({ children, className, style, fullFeaturedCodeBlock, ...props }) => {
    const { styles } = useStyles();
    const components: any = {
      a: Typography.Link,
      details: Collapse,
      hr: () => <Divider style={{ marginBottom: '1em', marginTop: 0 }} />,
      img: Image,
      pre: fullFeaturedCodeBlock ? CodeFullFeatured : CodeLite,
    };

    return (
      <Typography className={className} style={style}>
        <ErrorBoundary
          fallback={
            <ReactMarkdown
              className={styles.markdown}
              components={components}
              remarkPlugins={[remarkGfm]}
              {...props}
            >
              {children}
            </ReactMarkdown>
          }
        >
          <ReactMarkdown
            className={styles.markdown}
            components={components}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            remarkPlugins={[remarkGfm, remarkMath]}
            {...props}
          >
            {children}
          </ReactMarkdown>
        </ErrorBoundary>
      </Typography>
    );
  },
);

export default Markdown;
