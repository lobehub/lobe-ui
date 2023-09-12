import { codeToHtml } from 'shikiji';
import useSWR from 'swr';

import { themeConfig } from '@/Highlighter/theme';

export const useHighlight = (text: string, language: string, isDarkMode: boolean) =>
  useSWR<string>([text, language, String(isDarkMode)].join('-'), () =>
    codeToHtml(text, { lang: language, theme: themeConfig(isDarkMode) }),
  );

export { default as languageMap } from './languageMap';
