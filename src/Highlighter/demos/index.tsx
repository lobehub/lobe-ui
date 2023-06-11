import { Highlighter, HighlighterProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';

const code = `export default ({ children, className }: MarkdownProps) => {
  const { styles } = useStyles();
  return (
    <ReactMarkdown
      className={cx(styles.container, className)}
      components={{ pre: CodeBlock, code: Code }}
    >
      {children}
    </ReactMarkdown>
  );
}`;

export default () => {
  const store = useCreateStore();
  const options: HighlighterProps | any = useControls(
    {
      children: {
        value: code,
        rows: true,
      },
      language: 'tsx',
      type: {
        value: 'block',
        options: ['ghost', 'block', 'pure'],
      },
      copyable: true,
      showLanguage: true,
      theme: {
        value: null,
        options: [null, 'dark', 'light'],
      },
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Highlighter {...options} />
    </StroyBook>
  );
};
