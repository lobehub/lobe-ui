import { createStyles, cx } from 'antd-style';
import { PropsWithChildren, memo } from 'react';
import ReactMarkdown from 'react-markdown';

import CodeBlock from './CodeBlock';

const useStyles = createStyles(({ css, token, isDarkMode }) => {
  return {
    container: css`
      p:not(:last-child) {
        margin-bottom: 1em;
      }

      ol,
      ul {
        li {
          display: list-item;
        }
      }
    `,

    code: css`
      padding: 2px 4px;
      font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
      color: ${isDarkMode ? token.cyan8 : token.pink7};
      border-radius: 4px;
    `,
  };
});

const Code = memo((p: PropsWithChildren<any>) => {
  const { styles } = useStyles();
  return <code className={styles.code}>`{p.children}`</code>;
});

export interface MarkdownProps {
  children: string;
  className?: string;
}
export default ({ children, className }: MarkdownProps) => {
  const { styles } = useStyles();
  return (
    <ReactMarkdown
      className={cx(styles.container, className)}
      components={{ pre: CodeBlock, code: Code }}
    >
      {children}
    </ReactMarkdown>
  );
};
