import { type Highlighter, getHighlighter } from 'shikiji';
import useSWR from 'swr';

import { themeConfig } from '@/Highlighter/theme';

import languageMap from './languageMap'

export const FALLBACK_LANG = 'txt';

const FALLBACK_LANGS = [FALLBACK_LANG];

let cacheHighlighter: Highlighter;

const initHighlighter = async (lang: string): Promise<Highlighter> => {
  let highlighter = cacheHighlighter;
  if (highlighter && FALLBACK_LANGS.includes(lang)) {
    return highlighter;
  } else {
    FALLBACK_LANGS.push(lang);
    highlighter = await getHighlighter({
      langs: FALLBACK_LANGS,
      themes: [themeConfig(true), themeConfig(false)],
    });
    cacheHighlighter = highlighter;
    return highlighter;
  }
};

export const useHighlight = (text: string, language: string, isDarkMode: boolean) =>
  useSWR([text, language, Number(isDarkMode)].join('-'), async () => {
    try {
      const highlighter = await initHighlighter(language);
      const html = highlighter?.codeToHtml(text, {
        lang: languageMap.includes(language) ? language : FALLBACK_LANG,
        theme: isDarkMode ? 'dark' : 'light',
      });
      return html;
    } catch {
      return `<pre><code>${text}</code></pre>`;
    }
  });

export { default as languageMap } from './languageMap';
