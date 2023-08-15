import { Collapse, Divider, Typography } from 'antd';
import { CSSProperties, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Code from './Code';
import CodeBlock from './CodeBlock';
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
  style?: CSSProperties;
}

const Markdown = memo<MarkdownProps>(({ children, className, style, ...props }) => {
  const { styles } = useStyles();
  const components: any = {
    a: Typography.Link,
    code: Code,
    details: Collapse,
    hr: () => <Divider style={{ marginBottom: '1em', marginTop: 0 }} />,
    pre: CodeBlock,
  };

  return (
    <Typography className={className} style={style}>
      <ReactMarkdown
        className={styles.markdown}
        components={components}
        remarkPlugins={[remarkGfm]}
        {...props}
      >
        {children}
      </ReactMarkdown>
    </Typography>
  );
});

export default Markdown;
