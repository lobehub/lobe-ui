import { type HighlighterLanguageInfo, highlighterLanguages } from './languages';

interface HighlighterThemeItem {
  displayName: string;
  id: string;
}

export const bundledHighlighterThemes = [
  'andromeeda',
  'aurora-x',
  'ayu-dark',
  'ayu-light',
  'ayu-mirage',
  'catppuccin-frappe',
  'catppuccin-latte',
  'catppuccin-macchiato',
  'catppuccin-mocha',
  'dark-plus',
  'dracula',
  'dracula-soft',
  'everforest-dark',
  'everforest-light',
  'github-dark',
  'github-dark-default',
  'github-dark-dimmed',
  'github-dark-high-contrast',
  'github-light',
  'github-light-default',
  'github-light-high-contrast',
  'gruvbox-dark-hard',
  'gruvbox-dark-medium',
  'gruvbox-dark-soft',
  'gruvbox-light-hard',
  'gruvbox-light-medium',
  'gruvbox-light-soft',
  'horizon',
  'horizon-bright',
  'houston',
  'kanagawa-dragon',
  'kanagawa-lotus',
  'kanagawa-wave',
  'laserwave',
  'light-plus',
  'material-theme',
  'material-theme-darker',
  'material-theme-lighter',
  'material-theme-ocean',
  'material-theme-palenight',
  'min-dark',
  'min-light',
  'monokai',
  'night-owl',
  'night-owl-light',
  'nord',
  'one-dark-pro',
  'one-light',
  'pierre-dark',
  'pierre-dark-protanopia-deuteranopia',
  'pierre-dark-soft',
  'pierre-dark-tritanopia',
  'pierre-dark-vibrant',
  'pierre-light',
  'pierre-light-protanopia-deuteranopia',
  'pierre-light-soft',
  'pierre-light-tritanopia',
  'pierre-light-vibrant',
  'plastic',
  'poimandres',
  'red',
  'rose-pine',
  'rose-pine-dawn',
  'rose-pine-moon',
  'slack-dark',
  'slack-ochin',
  'snazzy-light',
  'solarized-dark',
  'solarized-light',
  'synthwave-84',
  'tokyo-night',
  'vesper',
  'vitesse-black',
  'vitesse-dark',
  'vitesse-light',
] as const;

export type BundledHighlighterTheme = (typeof bundledHighlighterThemes)[number];

const THEME_WORDS: Record<string, string> = {
  github: 'GitHub',
  pine: 'Pine',
  rose: 'Rosé',
};

const toThemeDisplayName = (id: string) =>
  id
    .split('-')
    .map((word) => THEME_WORDS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const highlighterThemes: HighlighterThemeItem[] = [
  {
    displayName: 'Lobe Theme',
    id: 'lobe-theme',
  },
  ...bundledHighlighterThemes.map((id) => ({
    displayName: toThemeDisplayName(id),
    id,
  })),
];

export const FALLBACK_LANG = 'plaintext';

const languageIndex = new Map<string, HighlighterLanguageInfo>();
for (const lang of highlighterLanguages) {
  for (const key of [lang.id, ...(lang.aliases ?? [])]) {
    if (!languageIndex.has(key)) languageIndex.set(key, lang);
  }
}

const findLanguage = (input: string) => languageIndex.get(input.toLocaleLowerCase());

export const getCodeLanguageByInput = (input: string): string => {
  if (!input) return FALLBACK_LANG;
  return findLanguage(input)?.id || FALLBACK_LANG;
};

export const getCodeLanguageFilename = (input: string): string => {
  if (!input) return 'Plaintext';
  const matchLang = findLanguage(input);
  const type = matchLang?.aliases?.[0] || matchLang?.id || 'txt';
  return `*.${type}`;
};

export const getCodeLanguageDisplayName = (input: string): string => {
  if (!input) return 'Plaintext';
  return findLanguage(input)?.name || 'Plaintext';
};
