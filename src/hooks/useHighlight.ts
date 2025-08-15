'use client';

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { useTheme, useThemeMode } from 'antd-style';
import { useMemo } from 'react';
import type { BuiltinTheme, CodeToHastOptions } from 'shiki';
import useSWR, { SWRResponse } from 'swr';
import { Md5 } from 'ts-md5';

import { getCodeLanguageByInput } from '@/Highlighter/const';

// Application-level cache to avoid repeated calculations
const MD5_LENGTH_THRESHOLD = 10_000; // Use async MD5 for text exceeding this length

// Color replacement mapping type
type ColorReplacements = {
  [themeName: string]: {
    [color: string]: string;
  };
};

type ICodeToHtml = (code: string, options: CodeToHastOptions) => Promise<string>;

// Lazy load shiki
const loadShiki = (): Promise<ICodeToHtml | null> => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  return import('shiki').then((mod) => mod.codeToHtml);
};
const shikiPromise = loadShiki();

// Helper function: Safe HTML escaping
const escapeHtml = (str: string): string => {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

// Main highlight component
export const useHighlight = (
  text: string,
  {
    language,
    enableTransformer,
    theme: builtinTheme,
  }: { enableTransformer?: boolean; language: string; theme?: BuiltinTheme },
): SWRResponse<string, Error> => {
  const { isDarkMode } = useThemeMode();
  const theme = useTheme();
  const lang = language.toLowerCase();

  // Match supported languages
  const matchedLanguage = useMemo(() => getCodeLanguageByInput(lang), [lang]);

  // Optimize transformer creation
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

  // Optimize color replacement configuration
  const colorReplacements = useMemo(
    (): ColorReplacements => ({
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
        '#0444ac': theme.geekblue,
        '#0991b6': theme.colorError,
        '#174781': theme.purple10,
        '#2f86d2': theme.colorText,
        '#357b42': theme.gray,
        '#7b30d0': theme.colorInfo,
        '#7eb233': theme.colorWarningTextActive,
        '#a44185': theme.colorSuccess,
        '#dc3eb7': theme.yellow11,
      },
    }),
    [theme],
  );

  // Build cache key
  const cacheKey = useMemo((): string | null => {
    // Use hash for long text
    const hash = text.length < MD5_LENGTH_THRESHOLD ? text : Md5.hashStr(text);
    return [matchedLanguage, builtinTheme || (isDarkMode ? 'd' : 'l'), hash]
      .filter(Boolean)
      .join('-');
  }, [text, matchedLanguage, isDarkMode, builtinTheme]);

  // Use SWR to get highlighted HTML
  return useSWR(
    cacheKey,
    async (): Promise<string> => {
      try {
        // Try full rendering
        const codeToHtml = await shikiPromise;
        if (!codeToHtml) return text;
        const html = await codeToHtml(text, {
          colorReplacements: builtinTheme ? undefined : colorReplacements,
          lang: matchedLanguage,
          theme: builtinTheme || (isDarkMode ? 'slack-dark' : 'slack-ochin'),
          transformers,
        });

        return html;
      } catch (error) {
        console.error('Advanced rendering failed:', error);

        try {
          // Try simple rendering (without transformers)
          const codeToHtml = await shikiPromise;
          if (!codeToHtml) return text;
          const html = await codeToHtml(text, {
            lang: matchedLanguage,
            theme: isDarkMode ? 'dark-plus' : 'light-plus',
          });
          return html;
        } catch {
          // Fallback to plain text
          const fallbackHtml = `<pre class="fallback"><code>${escapeHtml(text)}</code></pre>`;
          return fallbackHtml;
        }
      }
    },
    {
      dedupingInterval: 3000, // Only execute once for the same request within 3 seconds
      errorRetryCount: 2, // Retry at most 2 times
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
};

export { escapeHtml, loadShiki, MD5_LENGTH_THRESHOLD, shikiPromise };
