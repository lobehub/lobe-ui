import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { codeToHtml } from 'shiki';
import useSWR from 'swr';
import { Md5 } from 'ts-md5';

import { themeConfig } from '@/Highlighter/theme';

import languageMap from './languageMap';

export const FALLBACK_LANG = 'txt';

export const useHighlight = (text: string, lang: string, isDarkMode: boolean) =>
  useSWR(Md5.hashStr([lang.toLowerCase(), isDarkMode ? 'd' : 'l', text].join('-')), async () => {
    try {
      const language = lang.toLowerCase();
      return codeToHtml(text, {
        lang: languageMap.includes(language as any) ? language : FALLBACK_LANG,
        theme: themeConfig(isDarkMode),
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
          transformerNotationWordHighlight(),
          transformerNotationFocus(),
          transformerNotationErrorLevel(),
        ],
      });
    } catch (e) {
      console.error("shiki Highlight error:", e)
      return text;
    }
  });

export { default as languageMap } from './languageMap';
