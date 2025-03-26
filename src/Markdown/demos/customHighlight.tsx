import { ActionIcon, Markdown } from '@lobehub/ui';
import { AlertCircleIcon } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

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
  return (
    <Flexbox padding={16}>
      <Markdown
        componentProps={{
          highlight: {
            actionsRender: ({ content, actionIconSize, language, originalNode }) => {
              return (
                <>
                  {originalNode}
                  <ActionIcon
                    icon={AlertCircleIcon}
                    onClick={() => alert(language + content)}
                    size={actionIconSize}
                  />
                </>
              );
            },
          },
        }}
        fullFeaturedCodeBlock
      >
        {code}
      </Markdown>
    </Flexbox>
  );
};
