import { ActionIcon, Markdown, type MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { AlertCircleIcon } from 'lucide-react';

const code = `\`\`\`tsx
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
}
\`\`\`
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: code,
      },
      fullFeaturedCodeBlock: true,
    },
    { store },
  ) as MarkdownProps;
  return (
    <StoryBook levaStore={store}>
      <Markdown
        componentProps={{
          highlight: {
            actionsRender: ({ content, actionIconSize, language, originalNode }) => {
              return (
                <>
                  {originalNode}
                  <ActionIcon
                    icon={AlertCircleIcon}
                    size={actionIconSize}
                    onClick={() => alert(language + content)}
                  />
                </>
              );
            },
          },
        }}
        {...options}
      />
    </StoryBook>
  );
};
