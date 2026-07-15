import ColorSwatches from '@lobehub/ui/ColorSwatches';
import FluentEmoji from '@lobehub/ui/FluentEmoji';
import GroupAvatar from '@lobehub/ui/GroupAvatar';
import Highlighter from '@lobehub/ui/Highlighter';
import Hotkey from '@lobehub/ui/Hotkey';
import Markdown from '@lobehub/ui/Markdown';
import Snippet from '@lobehub/ui/Snippet';
import ThemeSwitch from '@lobehub/ui/ThemeSwitch';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { useSiteTheme } from '../../app/providers/SiteProviders';
import { styles } from './bentoGalleryStyle';

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

interface TileProps {
  children: ReactNode;
  className?: string;
  hint: string;
  title: string;
  to: string;
}

function Tile({ children, className, hint, title, to }: TileProps) {
  return (
    <div className={`${styles.tile} ${className ?? ''}`}>
      <div className={styles.tileHeader}>
        <Link to={to}>{title}</Link>
        <span>{hint}</span>
      </div>
      <div className={styles.tileBody}>{children}</div>
    </div>
  );
}

function ThemeSwitchTile() {
  const { preference, setPreference } = useSiteTheme();

  return (
    <ThemeSwitch
      themeMode={preference === 'system' ? 'auto' : preference}
      variant={'outlined'}
      onThemeSwitch={(mode) => setPreference(mode === 'auto' ? 'system' : mode)}
    />
  );
}

export function BentoGallery() {
  return (
    <section aria-labelledby="home-gallery" className={styles.root}>
      <h2 id="home-gallery">Built for AI interfaces</h2>
      <p>90+ components — every tile below is a live render, not a screenshot</p>
      <div className={styles.grid}>
        <Tile
          className={styles.tileLarge}
          hint="streaming · math · mermaid"
          title="Markdown"
          to="/components/markdown"
        >
          <Markdown fontSize={13} variant={'chat'}>
            {MARKDOWN_SAMPLE}
          </Markdown>
        </Tile>
        <Tile hint="try it" title="ThemeSwitch" to="/components/theme-switch">
          <ThemeSwitchTile />
        </Tile>
        <Tile hint="key bindings" title="Hotkey" to="/components/hotkey">
          <Hotkey keys={'mod+k'} variant={'outlined'} />
        </Tile>
        <Tile hint="one-line copy" title="Snippet" to="/components/snippet">
          <Snippet language={'bash'}>bun add @lobehub/ui</Snippet>
        </Tile>
        <Tile hint="pick one" title="ColorSwatches" to="/components/color-swatches">
          <ColorSwatches colors={SWATCH_COLORS} defaultValue={'#8b5cf6'} size={22} />
        </Tile>
        <Tile
          className={styles.tileWide}
          hint="shiki syntax highlighting"
          title="Highlighter"
          to="/components/highlighter"
        >
          <Highlighter language={'ts'} showLanguage={false} variant={'borderless'}>
            {HIGHLIGHTER_SAMPLE}
          </Highlighter>
        </Tile>
        <Tile hint="fluent 3D emoji" title="FluentEmoji" to="/components/fluent-emoji">
          <div className={styles.emojiRow}>
            <FluentEmoji emoji={'🎉'} size={36} />
            <FluentEmoji emoji={'🚀'} size={36} />
            <FluentEmoji emoji={'🧠'} size={36} />
          </div>
        </Tile>
        <Tile hint="avatar grid" title="GroupAvatar" to="/components/group-avatar">
          <GroupAvatar avatars={GROUP_AVATARS} size={56} />
        </Tile>
      </div>
    </section>
  );
}
