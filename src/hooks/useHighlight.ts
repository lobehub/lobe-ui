import { type Highlighter, getHighlighter } from 'shikiji';
import useSWR, { type SWRResponse } from 'swr';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { themeConfig } from '@/Highlighter/theme';

import languageMap from './languageMap';

export const FALLBACK_LANG = 'markdown';
const FALLBACK_LANGS = ['ts', 'typescript', 'js', 'javascript', 'markdown', 'md'];
const THEME = [themeConfig(true), themeConfig(false)];
interface Store {
  highlighter?: Highlighter;
  initHighlighter: () => Promise<Highlighter>;
  useCodeToHtml: (text: string, language: string, isDarkMode: boolean) => SWRResponse<string>;
}

export const useHighlight = createWithEqualityFn<Store>(
  (set, get) => ({
    highlighter: undefined,

    initHighlighter: async () => {
      let highlighter = get().highlighter;
      if (highlighter) {
        return highlighter;
      } else {
        highlighter = await getHighlighter({
          langs: FALLBACK_LANGS,
          themes: THEME,
        });
        set({ highlighter });
        return highlighter;
      }
    },

    useCodeToHtml: (text, language, isDarkMode) =>
      useSWR([text, language, Number(isDarkMode)].join('-'), async () => {
        const theme = isDarkMode ? 'dark' : 'light';
        let lang = language;
        try {
          const highlighter = await get().initHighlighter();
          if (!FALLBACK_LANGS.includes(lang)) {
            if (languageMap.includes(lang)) {
              await highlighter?.loadLanguage(lang as any);
            } else {
              lang = FALLBACK_LANG;
            }
          }
          const html = await highlighter?.codeToHtml(text, {
            lang,
            theme,
          });
          return html;
        } catch {
          return `<code>${text}</code>`;
        }
      }),
  }),
  shallow,
);

export { default as languageMap } from './languageMap';
