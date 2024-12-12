import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { useLayoutEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

import { themeConfig } from '@/Highlighter/theme';

import languageMap from './languageMap';

export const FALLBACK_LANG = 'txt';

const highlight = async (text: string, lang: string, isDarkMode: boolean) => {
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
};

export const useHighlight = (text: string, lang: string, isDarkMode: boolean) => {
  const [data, setData] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    setIsLoading(true);
    highlight(text, lang, isDarkMode).then((date) => {
      setData(date);
      setIsLoading(false);
    });
  }, [text, lang, isDarkMode]);

  return {
    data,
    isLoading,
  };
};

export { default as languageMap } from './languageMap';
