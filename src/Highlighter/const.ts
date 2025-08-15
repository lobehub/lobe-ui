import { bundledLanguagesInfo, bundledThemesInfo } from 'shiki';

interface HighlighterThemeItem {
  displayName: string;
  id: string;
}

export const highlighterThemes: HighlighterThemeItem[] = [
  {
    displayName: 'Lobe Theme',
    id: 'lobe-theme',
  },
  ...bundledThemesInfo.map((item) => ({
    displayName: item.displayName,
    id: item.id,
  })),
];

export const FALLBACK_LANG = 'plaintext';

export const getCodeLanguageByInput = (input: string): string => {
  if (!input) {
    return 'plaintext';
  }
  const inputLang = input.toLocaleLowerCase();

  const matchLang = bundledLanguagesInfo.find(
    (lang) => lang.id === inputLang || lang.aliases?.includes(inputLang),
  );
  return matchLang?.id || 'plaintext';
};

export const getCodeLanguageFilename = (input: string): string => {
  if (!input) {
    return 'Plaintext';
  }
  const inputLang = input.toLocaleLowerCase();

  const matchLang = bundledLanguagesInfo.find(
    (lang) => lang.id === inputLang || lang.aliases?.includes(inputLang),
  );
  const type = matchLang?.aliases?.[0] || matchLang?.id || 'txt';
  return `*.${type}`;
};

export const getCodeLanguageDisplayName = (input: string): string => {
  if (!input) {
    return 'Plaintext';
  }
  const inputLang = input.toLocaleLowerCase();

  const matchLang = bundledLanguagesInfo.find(
    (lang) => lang.id === inputLang || lang.aliases?.includes(inputLang),
  );
  return matchLang?.name || 'Plaintext';
};
