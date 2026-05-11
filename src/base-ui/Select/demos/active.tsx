'use client';

import { Flexbox } from '@lobehub/ui';
import { Select } from '@lobehub/ui/base-ui';
import { useRef, useState } from 'react';

const syntaxThemes = [
  { label: 'GitHub Light', value: 'github' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'One Dark Pro', value: 'one-dark-pro' },
  { label: 'Night Owl', value: 'night-owl' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Tokyo Night', value: 'tokyo-night' },
];

const themeColors: Record<string, { accent: string; bg: string; text: string }> = {
  'dracula': {
    accent: '#bd93f9',
    bg: '#282a36',
    text: '#f8f8f2',
  },
  'github': {
    accent: '#0969da',
    bg: '#ffffff',
    text: '#24292f',
  },
  'night-owl': {
    accent: '#7fdbca',
    bg: '#011627',
    text: '#d6deeb',
  },
  'one-dark-pro': {
    accent: '#61afef',
    bg: '#282c34',
    text: '#abb2bf',
  },
  'solarized-light': {
    accent: '#268bd2',
    bg: '#fdf6e3',
    text: '#657b83',
  },
  'tokyo-night': {
    accent: '#7aa2f7',
    bg: '#1a1b26',
    text: '#c0caf5',
  },
};

const sampleCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}`;

interface ThemePreviewProps {
  confirmed: string;
  preview: string | null;
}

const ThemePreview = ({ confirmed, preview }: ThemePreviewProps) => {
  const activeTheme = preview ?? confirmed;
  const { accent, bg, text } = themeColors[activeTheme] ?? themeColors['github'];

  return (
    <Flexbox gap={8} style={{ flex: 1, minWidth: 0 }}>
      <Flexbox
        style={{
          background: bg,
          borderRadius: 10,
          color: text,
          flex: 1,
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 1.6,
          padding: '14px 18px',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        <span style={{ color: accent, fontWeight: 600 }}>Theme: </span>
        {syntaxThemes.find((t) => t.value === activeTheme)?.label ?? activeTheme}
        <br />
        <pre style={{ color: text, margin: '8px 0 0' }}>{sampleCode}</pre>
      </Flexbox>
      <div style={{ fontSize: 12, opacity: 0.5 }}>
        Confirmed: <strong>{syntaxThemes.find((t) => t.value === confirmed)?.label}</strong>
        {preview && preview !== confirmed && (
          <span style={{ color: accent, marginLeft: 8 }}>
            ← previewing {syntaxThemes.find((t) => t.value === preview)?.label}
          </span>
        )}
      </div>
    </Flexbox>
  );
};

export default () => {
  const [confirmed, setConfirmed] = useState('github');
  const [preview, setPreview] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  return (
    <Flexbox
      gap={20}
      justify="center"
      style={{
        background: 'var(--lobe-color-fill-secondary)',
        borderRadius: 16,
        padding: 28,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600 }}>
        Hover / ↑↓ to preview · Enter / click to confirm
      </div>
      <Flexbox horizontal align="stretch" gap={16}>
        {/* Left: selector */}
        <Flexbox gap={8} style={{ flexShrink: 0, width: 200 }}>
          <Select
            options={syntaxThemes}
            style={{ width: '100%' }}
            value={confirmed}
            onActive={(v: string | null) => {
              clearTimeout(debounceRef.current);
              if (v === null) {
                setPreview(null);
                return;
              }
              debounceRef.current = setTimeout(() => setPreview(v), 80);
            }}
            onChange={(v: string) => {
              setPreview(null);
              clearTimeout(debounceRef.current);
              setConfirmed(v);
            }}
          />
        </Flexbox>
        {/* Right: preview */}
        <ThemePreview confirmed={confirmed} preview={preview} />
      </Flexbox>
    </Flexbox>
  );
};
