import { Divider, Typography } from 'antd';
import pangu from 'pangu';
import { memo } from 'react';
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
}

const Markdown = memo<MarkdownProps>(({ children, className }: MarkdownProps) => {
  const { styles, cx } = useStyles();
  const components: any = { pre: CodeBlock, code: Code, hr: Divider, a: Typography.Link };
  return (
    <Typography>
      <ReactMarkdown
        className={cx(styles.markdown, className)}
        components={components}
        remarkPlugins={[remarkGfm]}
      >
        {pangu.spacing(children)}
      </ReactMarkdown>
    </Typography>
  );
});

export default Markdown;
