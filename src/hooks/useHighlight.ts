import { type Highlighter, getHighlighter } from 'shikiji';
import useSWR from 'swr';

import { themeConfig } from '@/Highlighter/theme';

import languageMap from './languageMap';

export const FALLBACK_LANG = 'markdown';
const FALLBACK_LANGS = ['ts', 'typescript', 'js', 'javascript', 'markdown', 'md'];
const THEME = [themeConfig(true), themeConfig(false)];

let cacheHighlighter: Highlighter;

const initHighlighter = async (): Promise<Highlighter> => {
  let highlighter = cacheHighlighter;
  if (highlighter) {
    return highlighter;
  } else {
    highlighter = await getHighlighter({
      langs: FALLBACK_LANGS,
      themes: THEME,
    });
    cacheHighlighter = highlighter;
    return highlighter;
  }
};

export const useHighlight = (text: string, language: string, isDarkMode: boolean) =>
  useSWR([text, language, Number(isDarkMode)].join('-'), async () => {
    const theme = isDarkMode ? 'dark' : 'light';
    let lang = language;
    try {
      const highlighter = await initHighlighter();
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
  });

export { default as languageMap } from './languageMap';
