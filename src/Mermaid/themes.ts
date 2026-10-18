import type { CSSProperties } from 'react';

interface MermaidPalette {
  accent?: string;
  bg: string;
  fg: string;
  line?: string;
  muted?: string;
}

export const MERMAID_PRESETS = {
  'zinc-light': { bg: '#FFFFFF', fg: '#27272A' },
  'zinc-dark': { bg: '#18181B', fg: '#FAFAFA' },
  'tokyo-night': {
    accent: '#7aa2f7',
    bg: '#1a1b26',
    fg: '#a9b1d6',
    line: '#3d59a1',
    muted: '#565f89',
  },
  'tokyo-night-storm': {
    accent: '#7aa2f7',
    bg: '#24283b',
    fg: '#a9b1d6',
    line: '#3d59a1',
    muted: '#565f89',
  },
  'tokyo-night-light': {
    accent: '#34548a',
    bg: '#d5d6db',
    fg: '#343b58',
    line: '#34548a',
    muted: '#9699a3',
  },
  'catppuccin-mocha': {
    accent: '#cba6f7',
    bg: '#1e1e2e',
    fg: '#cdd6f4',
    line: '#585b70',
    muted: '#6c7086',
  },
  'catppuccin-latte': {
    accent: '#8839ef',
    bg: '#eff1f5',
    fg: '#4c4f69',
    line: '#9ca0b0',
    muted: '#9ca0b0',
  },
  'nord': { accent: '#88c0d0', bg: '#2e3440', fg: '#d8dee9', line: '#4c566a', muted: '#616e88' },
  'nord-light': {
    accent: '#5e81ac',
    bg: '#eceff4',
    fg: '#2e3440',
    line: '#aab1c0',
    muted: '#7b88a1',
  },
  'dracula': { accent: '#bd93f9', bg: '#282a36', fg: '#f8f8f2', line: '#6272a4', muted: '#6272a4' },
  'github-light': {
    accent: '#0969da',
    bg: '#ffffff',
    fg: '#1f2328',
    line: '#d1d9e0',
    muted: '#59636e',
  },
  'github-dark': {
    accent: '#4493f8',
    bg: '#0d1117',
    fg: '#e6edf3',
    line: '#3d444d',
    muted: '#9198a1',
  },
  'solarized-light': {
    accent: '#268bd2',
    bg: '#fdf6e3',
    fg: '#657b83',
    line: '#93a1a1',
    muted: '#93a1a1',
  },
  'solarized-dark': {
    accent: '#268bd2',
    bg: '#002b36',
    fg: '#839496',
    line: '#586e75',
    muted: '#586e75',
  },
  'one-dark': {
    accent: '#c678dd',
    bg: '#282c34',
    fg: '#abb2bf',
    line: '#4b5263',
    muted: '#5c6370',
  },
} satisfies Record<string, MermaidPalette>;

export type MermaidPresetName = keyof typeof MERMAID_PRESETS;

export type MermaidThemeName = 'lobe-theme' | MermaidPresetName;

export const isMermaidPreset = (theme?: string): theme is MermaidPresetName =>
  !!theme && theme !== 'lobe-theme' && Object.hasOwn(MERMAID_PRESETS, theme);

const SERIES = ['blue', 'gold', 'green', 'red', 'purple', 'cyan', 'orange', 'magenta'];

const seriesVars = Object.fromEntries(
  SERIES.map((color, index) => [`--pele-series-${index + 1}`, `var(--lobe-${color})`]),
);

const sharedVars = {
  '--pele-critical': 'var(--lobe-color-error)',
  '--pele-error': 'var(--lobe-color-error)',
  '--pele-font': 'var(--lobe-font-family)',
  '--pele-font-mono': 'var(--lobe-font-family-code)',
  '--pele-radius': 'var(--lobe-border-radius)',
  ...seriesVars,
};

const LOBE_THEME_VARS = {
  ...sharedVars,
  '--pele-accent': 'var(--lobe-color-primary)',
  '--pele-bg': 'var(--lobe-color-bg-container)',
  '--pele-border': 'var(--lobe-color-border)',
  '--pele-fg': 'var(--lobe-color-text)',
  '--pele-line': 'var(--lobe-color-text-secondary)',
  '--pele-muted': 'var(--lobe-color-text-description)',
  '--pele-surface': 'var(--lobe-color-fill-tertiary)',
  '--pele-surface-alt': 'var(--lobe-color-fill-secondary)',
} as CSSProperties;

const mix = ({ bg, fg }: MermaidPalette, percent: number) =>
  `color-mix(in srgb, ${fg} ${percent}%, ${bg})`;

const presetVars = (palette: MermaidPalette) =>
  ({
    ...sharedVars,
    '--pele-accent': palette.accent ?? palette.fg,
    '--pele-bg': palette.bg,
    '--pele-border': mix(palette, 20),
    '--pele-fg': palette.fg,
    '--pele-line': palette.line ?? mix(palette, 50),
    '--pele-muted': palette.muted ?? mix(palette, 60),
    '--pele-surface': mix(palette, 4),
    '--pele-surface-alt': mix(palette, 10),
  }) as CSSProperties;

const PRESET_VARS = Object.fromEntries(
  Object.entries(MERMAID_PRESETS).map(([name, palette]) => [name, presetVars(palette)]),
) as Record<MermaidPresetName, CSSProperties>;

export const getMermaidThemeVars = (theme?: string): CSSProperties =>
  isMermaidPreset(theme) ? PRESET_VARS[theme] : LOBE_THEME_VARS;
