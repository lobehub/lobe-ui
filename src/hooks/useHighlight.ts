'use client';

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { useTheme, useThemeMode } from 'antd-style';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import type { BuiltinTheme, CodeToHastOptions, ThemedToken } from 'shiki';
import { Md5 } from 'ts-md5';

import { getCodeLanguageByInput } from '@/Highlighter/const';

// Application-level cache to avoid repeated calculations
export const MD5_LENGTH_THRESHOLD = 10_000; // Use async MD5 for text exceeding this length

// Color replacement mapping type
export type ColorReplacements = {
  [themeName: string]: {
    [color: string]: string;
  };
};

export type StreamingHighlightResult = {
  colorReplacements?: Record<string, string>;
  lines: ThemedToken[][];
  preStyle?: CSSProperties;
};

// Application-level cache for highlighted HTML
// Key: cacheKey string, Value: Promise<string>
const highlightCache = new Map<string, Promise<string>>();

// Maximum cache size to prevent memory leaks
const MAX_CACHE_SIZE = 1000;

// Clean up old cache entries when limit is reached
const cleanupCache = () => {
  if (highlightCache.size > MAX_CACHE_SIZE) {
    // Remove oldest 20% of entries
    const entriesToRemove = Math.floor(MAX_CACHE_SIZE * 0.2);
    const keysToRemove = Array.from(highlightCache.keys()).slice(0, entriesToRemove);
    for (const key of keysToRemove) {
      highlightCache.delete(key);
    }
  }
};

export type ICodeToHtml = (code: string, options: CodeToHastOptions) => Promise<string>;
export type ShikiModule = typeof import('shiki');

// Lazy load shiki
export const loadShikiModule = (): Promise<ShikiModule | null> => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  return import('shiki');
};
export const shikiModulePromise = loadShikiModule();

export const loadShiki = (): Promise<ICodeToHtml | null> => {
  return shikiModulePromise.then((mod) => mod?.codeToHtml ?? null);
};
export const shikiPromise = loadShiki();

// Helper function: Safe HTML escaping
export const escapeHtml = (str: string): string => {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

// Main highlight component - optimized version without SWR
export const useHighlight = (
  text: string,
  {
    language,
    enableTransformer,
    theme: builtinTheme,
    streaming,
  }: { enableTransformer?: boolean; language: string; streaming?: boolean; theme?: BuiltinTheme },
): string => {
  const { isDarkMode } = useThemeMode();
  const theme = useTheme();

  // Safely handle language and text with boundary checks
  const safeText = text ?? '';
  const lang = (language ?? 'plaintext').toLowerCase();

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

  // Optimize color replacement configuration - only depend on specific theme properties
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
    [
      theme.yellow,
      theme.colorError,
      theme.gray,
      theme.colorText,
      theme.purple10,
      theme.colorInfo,
      theme.colorSuccess,
      theme.colorWarning,
      theme.geekblue,
      theme.colorWarningTextActive,
      theme.yellow11,
    ],
  );

  // Build cache key
  const cacheKey = useMemo((): string | null => {
    if (streaming) return null;
    // Use hash for long text
    const hash = safeText.length < MD5_LENGTH_THRESHOLD ? safeText : Md5.hashStr(safeText);
    return [matchedLanguage, builtinTheme || (isDarkMode ? 'd' : 'l'), hash]
      .filter(Boolean)
      .join('-');
  }, [safeText, matchedLanguage, isDarkMode, builtinTheme, streaming]);

  const [data, setData] = useState<string | undefined>();

  useEffect(() => {
    if (!cacheKey) {
      setData(undefined);
      return;
    }

    // Check cache first
    const cachedPromise = highlightCache.get(cacheKey);
    if (cachedPromise) {
      cachedPromise
        .then((html) => {
          setData(html);
        })
        .catch(() => {
          // Silently handle errors, fallback will be handled in the promise
        });
      return;
    }

    // Create new promise for highlighting
    const highlightPromise = (async (): Promise<string> => {
      try {
        // Try full rendering
        const codeToHtml = await shikiPromise;
        if (!codeToHtml) return safeText;
        const html = await codeToHtml(safeText, {
          colorReplacements: builtinTheme ? undefined : colorReplacements,
          lang: matchedLanguage,
          theme: builtinTheme || (isDarkMode ? 'slack-dark' : 'slack-ochin'),
          transformers,
        });

        return html;
      } catch (error_) {
        console.error('Advanced rendering failed:', error_);

        try {
          // Try simple rendering (without transformers)
          const codeToHtml = await shikiPromise;
          if (!codeToHtml) return safeText;
          const html = await codeToHtml(safeText, {
            lang: matchedLanguage,
            theme: isDarkMode ? 'dark-plus' : 'light-plus',
          });
          return html;
        } catch {
          // Fallback to plain text
          const fallbackHtml = `<pre class="fallback"><code>${escapeHtml(safeText)}</code></pre>`;
          return fallbackHtml;
        }
      }
    })();

    // Cache the promise
    highlightCache.set(cacheKey, highlightPromise);
    cleanupCache();

    // Handle promise result
    highlightPromise
      .then((html) => {
        // Only update if this is still the current cache key
        if (highlightCache.get(cacheKey) === highlightPromise) {
          setData(html);
        }
      })
      .catch(() => {
        // Remove failed promise from cache
        if (highlightCache.get(cacheKey) === highlightPromise) {
          highlightCache.delete(cacheKey);
        }
      });
  }, [
    cacheKey,
    safeText,
    matchedLanguage,
    builtinTheme,
    isDarkMode,
    colorReplacements,
    transformers,
  ]);

  return data || '';
};
