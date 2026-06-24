interface HighlighterThemeItem {
  displayName: string;
  id: string;
}

export const highlighterThemes: HighlighterThemeItem[] = [
  {
    displayName: 'Lobe Theme',
    id: 'lobe-theme',
  },
];

export const FALLBACK_LANG = 'plaintext';

export const getCodeLanguageByInput = (input: string): string => {
  if (!input) return 'plaintext';
  return input.toLocaleLowerCase();
};

export const getCodeLanguageFilename = (input: string): string => {
  if (!input) return 'Plaintext';
  return `*.${input.toLocaleLowerCase()}`;
};

export const getCodeLanguageDisplayName = (input: string): string => {
  if (!input) return 'Plaintext';
  return input.charAt(0).toUpperCase() + input.slice(1);
};
