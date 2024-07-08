import { Highlighter, HighlighterProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';

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
        rows: true,
        value: code,
      },
      copyable: true,
      language: 'tsx',
      showLanguage: true,
      type: {
        options: ['ghost', 'block', 'pure'],
        value: 'block',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Highlighter fullFeatured {...options} style={{ ...options.style, width: '100%' }} />
    </StoryBook>
  );
};
