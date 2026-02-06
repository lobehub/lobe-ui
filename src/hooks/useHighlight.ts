'use client';

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import type { BuiltinTheme, CodeToHastOptions, ThemedToken } from 'shiki';
import { Md5 } from 'ts-md5';

import { getCodeLanguageByInput } from '@/Highlighter/const';
import lobeTheme from '@/Highlighter/theme/lobe-theme';

// Application-level cache to avoid repeated calculations
export const MD5_LENGTH_THRESHOLD = 10_000; // Use async MD5 for text exceeding this length

export type StreamingHighlightResult = {
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

// Use codeToHtml shorthand for better performance
// It automatically manages highlighter instances and loads themes/languages on-demand
let codeToHtmlPromise: Promise<ICodeToHtml | null> | null = null;

const loadCodeToHtml = (): Promise<ICodeToHtml | null> => {
  if (typeof window === 'undefined') return Promise.resolve(null);

  if (!codeToHtmlPromise) {
    codeToHtmlPromise = import('shiki').then((mod) => mod.codeToHtml ?? null);
  }

  return codeToHtmlPromise;
};

// Export shikiModulePromise for useStreamHighlight compatibility
const loadShikiModule = (): Promise<ShikiModule | null> => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  return import('shiki');
};
export const shikiModulePromise = loadShikiModule();

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
const customThemes = {
  'lobe-theme': lobeTheme,
};

export const useHighlight = (
  text: string,
  {
    language,
    enableTransformer,
    theme: builtinTheme,
    streaming,
  }: { enableTransformer?: boolean; language: string; streaming?: boolean; theme?: BuiltinTheme },
): string => {
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

  // Build cache key
  const cacheKey = useMemo((): string | null => {
    if (streaming) return null;
    // Use hash for long text
    const hash = safeText.length < MD5_LENGTH_THRESHOLD ? safeText : Md5.hashStr(safeText);
    return [matchedLanguage, builtinTheme, hash].filter(Boolean).join('-');
  }, [safeText, matchedLanguage, builtinTheme, streaming]);

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
    // Using codeToHtml shorthand: automatically loads themes/languages on-demand
    const highlightPromise = (async (): Promise<string> => {
      try {
        // Try full rendering with transformers
        const shikiModule = await shikiModulePromise;
        if (!shikiModule) return safeText;

        const effectiveTheme = builtinTheme || 'lobe-theme';

        // Load custom theme if using slack-dark or slack-ochin
        if (!builtinTheme && effectiveTheme === 'lobe-theme') {
          const customTheme = customThemes[effectiveTheme];
          if (customTheme) {
            // Use getSingletonHighlighter to load custom theme
            const highlighter = await shikiModule.getSingletonHighlighter({
              langs: [matchedLanguage],
              themes: [customTheme as any],
            });

            const html = await highlighter.codeToHtml(safeText, {
              lang: matchedLanguage,
              theme: effectiveTheme,
              transformers,
            });

            return html;
          }
        }

        // Fallback to codeToHtml for builtin themes
        const codeToHtml = await loadCodeToHtml();
        if (!codeToHtml) return safeText;

        const html = await codeToHtml(safeText, {
          lang: matchedLanguage,
          theme: effectiveTheme,
          transformers,
        });

        return html;
      } catch (error_) {
        console.error('Advanced rendering failed:', error_);

        try {
          // Try simple rendering (without transformers)
          const codeToHtml = await loadCodeToHtml();
          if (!codeToHtml) return safeText;
          const html = await codeToHtml(safeText, {
            lang: matchedLanguage,
            theme: 'lobe-theme',
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
  }, [cacheKey, safeText, matchedLanguage, builtinTheme, transformers, customThemes]);

  return data || '';
};
