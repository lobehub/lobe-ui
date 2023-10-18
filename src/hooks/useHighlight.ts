import { type Highlighter, getHighlighter } from 'shikiji';
import useSWR from 'swr';

import { themeConfig } from '@/Highlighter/theme';

import languageMap from './languageMap'

export const FALLBACK_LANG = 'txt';

const FALLBACK_LANGS = [FALLBACK_LANG];

let cacheHighlighter: Highlighter;

const initHighlighter = async (lang: string): Promise<Highlighter> => {
  let highlighter = cacheHighlighter;
  const language = lang.toLowerCase()
  
  if (highlighter && FALLBACK_LANGS.includes(language)) return highlighter

  if (languageMap.includes(language) && !FALLBACK_LANGS.includes(language)) {
    FALLBACK_LANGS.push(language);
  }
  
  highlighter = await getHighlighter({
    langs: FALLBACK_LANGS,
    themes: [themeConfig(true), themeConfig(false)],
  });
  
  cacheHighlighter = highlighter;
  
  return highlighter;
};

export const useHighlight = (text: string, lang: string, isDarkMode: boolean) =>
  useSWR([text, language, Number(isDarkMode)].join('-'), async () => {
    try {
      const highlighter = await initHighlighter(language);
      const language = lang.toLowerCase()
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
