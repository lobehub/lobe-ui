import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { useTheme, useThemeMode } from 'antd-style';
import { useMemo } from 'react';
import { codeToHtml } from 'shiki';
import useSWR from 'swr';
import { Md5 } from 'ts-md5';

import languageMap from './languageMap';

export const FALLBACK_LANG = 'txt';

export const useHighlight = (text: string, lang: string, enableTransformer?: boolean) => {
  const { isDarkMode } = useThemeMode();
  const language = lang.toLowerCase();
  const matchedLanguage = useMemo(
    () => (languageMap.includes(language as any) ? language : FALLBACK_LANG),
    [language],
  );
  const theme = useTheme();
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
        colorReplacements: {
          'slack-dark': {
            '#4ec9b0': theme.yellow,
            '#569cd6': theme.colorError,
            '#6a9955': theme.gray,
            '#9cdcfe': theme.colorText,
            '#b5cea8': theme.purple10,
            '#c586c0': theme.colorInfo,
            '#ce9178': theme.colorSuccess,
            '#dcdcaa': theme.colorWarning,
            '#e6e6e6': theme.colorText,
          },
          'slack-ochin': {
            '#002339': theme.colorText,
            '#0991b6': theme.colorError,
            '#174781': theme.purple10,
            '#2f86d2': theme.colorText,
            '#357b42': theme.gray,
            '#7b30d0': theme.colorInfo,
            '#7eb233': theme.colorWarningTextActive,
            '#a44185': theme.colorSuccess,
            '#dc3eb7': theme.yellow11,
          },
        },
        lang: matchedLanguage,
        theme: isDarkMode ? 'slack-dark' : 'slack-ochin',
        transformers,
      });
    } catch (error) {
      console.error('shiki Highlight error:', error);
      return text;
    }
  });
};

export { default as languageMap } from './languageMap';
