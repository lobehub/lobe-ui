import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { type Highlighter, getHighlighter } from 'shiki';
import useSWR from 'swr';

import { themeConfig } from '@/Highlighter/theme';

import languageMap from './languageMap';

export const FALLBACK_LANG = 'txt';

const FALLBACK_LANGS = [FALLBACK_LANG];

let cacheHighlighter: Highlighter;

const initHighlighter = async (lang: string): Promise<Highlighter> => {
  let highlighter = cacheHighlighter;
  const language = lang.toLowerCase();

  if (highlighter && FALLBACK_LANGS.includes(language)) return highlighter;

  if (languageMap.includes(language as any) && !FALLBACK_LANGS.includes(language)) {
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
  useSWR(
    [lang.toLowerCase(), isDarkMode ? 'dark' : 'light', text].join('-'),
    async () => {
      try {
        const language = lang.toLowerCase();
        const highlighter = await initHighlighter(language);
        const html = highlighter?.codeToHtml(text, {
          lang: languageMap.includes(language as any) ? language : FALLBACK_LANG,
          theme: isDarkMode ? 'dark' : 'light',
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            transformerNotationFocus(),
            transformerNotationErrorLevel(),
          ],
        });
        return html;
      } catch {
        return `<pre><code>${text}</code></pre>`;
      }
    },
    { revalidateOnFocus: false },
  );

export { default as languageMap } from './languageMap';
