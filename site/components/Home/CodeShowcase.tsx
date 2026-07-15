import Button from '@lobehub/ui/Button';
import { ChatItem } from '@lobehub/ui/chat';
import Highlighter from '@lobehub/ui/Highlighter';
import Markdown from '@lobehub/ui/Markdown';
import Tag from '@lobehub/ui/Tag';
import ThemeProvider from '@lobehub/ui/ThemeProvider';
import { useState } from 'react';

import { styles } from './codeShowcaseStyle';

const MARKDOWN_CONTENT = `## Hello

Streaming **markdown** with \`inline code\`:

- GFM tables and lists
- KaTeX math, Mermaid charts`;

const CHAT_MESSAGE =
  'LobeHub UI ships chat primitives: bubbles, actions, editing — batteries included.';

const EXAMPLES = [
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
    render: (
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
    render: (
      <ChatItem
        avatar={{ avatar: '🤖', backgroundColor: '#8b5cf6', title: 'Assistant' }}
        fontSize={13}
        message={CHAT_MESSAGE}
      />
    ),
  },
  {
    code: `import { ThemeProvider, Button } from '@lobehub/ui'

export default () => (
  <ThemeProvider
    customTheme={{ primaryColor: 'purple' }}
  >
    <Button type={'primary'}>Purple</Button>
  </ThemeProvider>
)`,
    key: 'theming',
    label: 'Theming',
    render: (
      <ThemeProvider customTheme={{ primaryColor: 'purple' }} enableGlobalStyle={false}>
        <div className={styles.themingRow}>
          <Button type={'primary'}>Purple</Button>
          <Button>Default</Button>
          <Tag color={'purple'}>primaryColor</Tag>
        </div>
      </ThemeProvider>
    ),
  },
] as const;

export default function CodeShowcase() {
  const [activeKey, setActiveKey] = useState<(typeof EXAMPLES)[number]['key']>('markdown');
  const active = EXAMPLES.find((example) => example.key === activeKey) ?? EXAMPLES[0];

  return (
    <section aria-labelledby="home-showcase" className={styles.root}>
      <h2 id="home-showcase">Code you write, UI you get</h2>
      <p>Switch tabs — each snippet on the left renders live on the right.</p>
      <div className={styles.tabs} role="tablist">
        {EXAMPLES.map(({ key, label }) => (
          <button
            aria-selected={key === activeKey}
            className={key === activeKey ? styles.tabActive : styles.tab}
            key={key}
            role="tab"
            type="button"
            onClick={() => setActiveKey(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.panes}>
        <div className={styles.codePane}>
          <Highlighter language={'tsx'} showLanguage={false} variant={'borderless'}>
            {active.code}
          </Highlighter>
        </div>
        <div className={styles.previewPane}>{active.render}</div>
      </div>
    </section>
  );
}
