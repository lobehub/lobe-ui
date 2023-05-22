import { Highlighter } from '@lobehub/ui';

const code = `
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

`;
export default () => {
  return (
    <Highlighter theme={'dark'} language={'tsx'}>
      {code}
    </Highlighter>
  );
};
