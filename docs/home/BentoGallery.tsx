import { Flexbox } from '@lobehub/ui';
import { BentoCard, BentoGrid } from '@lobehub/ui/awesome';
import ColorSwatches from '@lobehub/ui/ColorSwatches';
import FluentEmoji from '@lobehub/ui/FluentEmoji';
import GroupAvatar from '@lobehub/ui/GroupAvatar';
import Highlighter from '@lobehub/ui/Highlighter';
import Hotkey from '@lobehub/ui/Hotkey';
import Markdown from '@lobehub/ui/Markdown';
import Snippet from '@lobehub/ui/Snippet';
import ThemeSwitch from '@lobehub/ui/ThemeSwitch';
import { useTheme } from 'next-themes';

import { renderLink } from './renderLink';

const MARKDOWN_SAMPLE = `#### Streaming Markdown

Renders **GFM**, math, mermaid and \`code\` out of the box:

- Tables, task lists, footnotes
- KaTeX math and Mermaid charts
- Streaming-friendly rendering

> Built for AI conversation content.`;

const HIGHLIGHTER_SAMPLE = `const { message } = await client.chat({
  model: 'claude-fable-5',
  stream: true,
})`;

const SWATCH_COLORS = [
  { color: '#8b5cf6', title: 'Violet' },
  { color: '#3b82f6', title: 'Blue' },
  { color: '#06b6d4', title: 'Cyan' },
  { color: '#10b981', title: 'Green' },
  { color: '#f59e0b', title: 'Amber' },
  { color: '#ec4899', title: 'Pink' },
];

const GROUP_AVATARS = ['😀', '🤖', '🦄', '🐬'];

function ThemeSwitchTile() {
  const { setTheme, theme } = useTheme();
  const preference = theme === 'light' || theme === 'dark' ? theme : 'system';

  return (
    <ThemeSwitch
      themeMode={preference === 'system' ? 'auto' : preference}
      variant={'outlined'}
      onThemeSwitch={(mode) => setTheme(mode === 'auto' ? 'system' : mode)}
    />
  );
}

export function BentoGallery() {
  return (
    <BentoGrid>
      <BentoCard
        colSpan={2}
        hint="streaming · math · mermaid"
        href="/components/markdown"
        renderLink={renderLink}
        rowSpan={2}
        title="Markdown"
      >
        <Markdown fontSize={13} variant={'chat'}>
          {MARKDOWN_SAMPLE}
        </Markdown>
      </BentoCard>
      <BentoCard
        hint="try it"
        href="/components/theme-switch"
        renderLink={renderLink}
        title="ThemeSwitch"
      >
        <ThemeSwitchTile />
      </BentoCard>
      <BentoCard
        hint="key bindings"
        href="/components/hotkey"
        renderLink={renderLink}
        title="Hotkey"
      >
        <Hotkey keys={'mod+k'} variant={'outlined'} />
      </BentoCard>
      <BentoCard
        hint="one-line copy"
        href="/components/snippet"
        renderLink={renderLink}
        title="Snippet"
      >
        <Snippet language={'bash'}>pnpm add @lobehub/ui</Snippet>
      </BentoCard>
      <BentoCard
        hint="pick one"
        href="/components/color-swatches"
        renderLink={renderLink}
        title="ColorSwatches"
      >
        <ColorSwatches colors={SWATCH_COLORS} defaultValue={'#8b5cf6'} size={22} />
      </BentoCard>
      <BentoCard
        colSpan={2}
        hint="shiki syntax highlighting"
        href="/components/highlighter"
        renderLink={renderLink}
        title="Highlighter"
      >
        <Highlighter language={'ts'} variant={'filled'}>
          {HIGHLIGHTER_SAMPLE}
        </Highlighter>
      </BentoCard>
      <BentoCard
        hint="fluent 3D emoji"
        href="/components/fluent-emoji"
        renderLink={renderLink}
        title="FluentEmoji"
      >
        <Flexbox horizontal align={'center'} gap={10}>
          <FluentEmoji emoji={'🎉'} size={36} />
          <FluentEmoji emoji={'🚀'} size={36} />
          <FluentEmoji emoji={'🧠'} size={36} />
        </Flexbox>
      </BentoCard>
      <BentoCard
        hint="avatar grid"
        href="/components/group-avatar"
        renderLink={renderLink}
        title="GroupAvatar"
      >
        <GroupAvatar avatars={GROUP_AVATARS} size={56} />
      </BentoCard>
    </BentoGrid>
  );
}
