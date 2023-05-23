import { Divider, Typography } from 'antd';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStyles } from './style';

import Code from './Code';
import CodeBlock from './CodeBlock';
export interface MarkdownProps {
  /**
   * @description The markdown content to be rendered
   */
  children: string;
  /**
   * @description The class name for the Markdown component
   */
  className?: string;
}

const Markdown = memo<MarkdownProps>(({ children, className }: MarkdownProps) => {
  const { styles, cx } = useStyles();
  const components: any = { pre: CodeBlock, code: Code, hr: Divider, a: Typography.Link };
  return (
    <Typography>
      <ReactMarkdown
        className={cx(styles.container, className)}
        components={components}
        remarkPlugins={[remarkGfm]}
      >
        {children}
      </ReactMarkdown>
    </Typography>
  );
});

export default Markdown;
