import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { useThemeMode } from 'antd-style';
import { useMemo } from 'react';
import { codeToHtml } from 'shiki';
import useSWR from 'swr';
import { Md5 } from 'ts-md5';

import { themeConfig } from '@/Highlighter/theme';

import languageMap from './languageMap';

export const FALLBACK_LANG = 'txt';

export const useHighlight = (text: string, lang: string, enableTransformer?: boolean) => {
  const { isDarkMode } = useThemeMode();
  const language = lang.toLowerCase();
  const matchedLanguage = useMemo(
    () => (languageMap.includes(language as any) ? language : FALLBACK_LANG),
    [language],
  );
  const theme = useMemo(() => themeConfig(isDarkMode), [isDarkMode]);
  const transformers = useMemo(() => {
    if (!enableTransformer) return;
    return [
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
    ];
  }, [enableTransformer]);

  const key = useMemo(() => Md5.hashStr(text), [text]);

  return useSWR([matchedLanguage, isDarkMode ? 'd' : 'l', key].join('-'), async () => {
    try {
      return codeToHtml(text, {
        lang: matchedLanguage,
        theme,
        transformers,
      });
    } catch (error) {
      console.error('shiki Highlight error:', error);
      return text;
    }
  });
};

export { default as languageMap } from './languageMap';
