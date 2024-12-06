import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { codeToHtml } from 'shiki';
import useSWR from 'swr';

import { themeConfig } from '@/Highlighter/theme';

export const FALLBACK_LANG = 'txt';

export const useHighlight = (text: string, lang: string, isDarkMode: boolean) =>
  useSWR(
    [lang.toLowerCase(), isDarkMode ? 'd' : 'l', text].join('-'),
    async () => {
      try {
        const language = lang.toLowerCase();
        return codeToHtml(text, {
          lang: language,
          theme: themeConfig(isDarkMode),
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            transformerNotationFocus(),
            transformerNotationErrorLevel(),
          ],
        });
      } catch {
        return text;
      }
    },
    { revalidateOnFocus: false },
  );

export { default as languageMap } from './languageMap';
