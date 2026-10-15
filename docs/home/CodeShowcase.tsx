import { Button, Flexbox, Tag, ThemeScope } from '@lobehub/ui';
import { CodeShowcase, type CodeShowcaseItem } from '@lobehub/ui/awesome';
import { ChatItem } from '@lobehub/ui/chat';
import Markdown from '@lobehub/ui/Markdown';

const MARKDOWN_CONTENT = `## Hello

Streaming **markdown** with \`inline code\`:

- GFM tables and lists
- KaTeX math, Mermaid charts`;

const CHAT_MESSAGE =
  'LobeHub UI ships chat primitives: bubbles, actions, editing — batteries included.';

const EXAMPLES: CodeShowcaseItem[] = [
  {
    code: `import { Markdown } from '@lobehub/ui'

export default () => (
  <Markdown variant={'chat'}>
    {\`## Hello

Streaming **markdown**…\`}
  </Markdown>
)`,
    key: 'markdown',
    label: 'Markdown',
    preview: (
      <Markdown fontSize={13} variant={'chat'}>
        {MARKDOWN_CONTENT}
      </Markdown>
    ),
  },
  {
    code: `import { ChatItem } from '@lobehub/ui/chat'

export default () => (
  <ChatItem
    avatar={{ avatar: '🤖', title: 'Assistant' }}
    message={message}
  />
)`,
    key: 'chat',
    label: 'Chat message',
    preview: (
      <ChatItem
        avatar={{ avatar: '🤖', backgroundColor: '#8b5cf6', title: 'Assistant' }}
        fontSize={13}
        message={CHAT_MESSAGE}
      />
    ),
  },
  {
    code: `import { Button, ThemeScope } from '@lobehub/ui'

export default () => (
  <ThemeScope primaryColor={'purple'}>
    <Button type={'primary'}>Purple</Button>
  </ThemeScope>
)`,
    key: 'theming',
    label: 'Theming',
    preview: (
      <ThemeScope primaryColor={'purple'}>
        <Flexbox horizontal align={'center'} gap={10} wrap={'wrap'}>
          <Button type={'primary'}>Purple</Button>
          <Button>Default</Button>
          <Tag color={'purple'}>primaryColor</Tag>
        </Flexbox>
      </ThemeScope>
    ),
  },
];

export function CodeShowcaseSection() {
  return <CodeShowcase items={EXAMPLES} />;
}
