'use client';

import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import type { BuiltinTheme, ThemedToken } from 'shiki';
import type { HighlighterCore } from 'shiki/core';
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

// Helper function: Safe HTML escaping
export const escapeHtml = (str: string): string => {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

// Singleton highlighter using shiki/core for minimal bundle size
let highlighterPromise: Promise<HighlighterCore> | null = null;

export const getOrCreateHighlighter = (): Promise<HighlighterCore> | null => {
  if (typeof window === 'undefined') return null;
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createOnigurumaEngine }] = await Promise.all([
        import('shiki/core'),
        import('shiki/engine/oniguruma'),
      ]);
      return createHighlighterCore({
        engine: createOnigurumaEngine(() => import('shiki/wasm')),
      });
    })();
  }
  return highlighterPromise;
};

// Dynamically load a language on demand via shiki/langs
export const ensureLanguage = async (highlighter: HighlighterCore, lang: string) => {
  if (highlighter.getLoadedLanguages().includes(lang)) return;
  try {
    const { bundledLanguages } = await import('shiki/langs');
    const loader = bundledLanguages[lang as keyof typeof bundledLanguages];
    if (loader) {
      await highlighter.loadLanguage(await loader());
    }
  } catch {
    // Language not found, highlighter will fallback
  }
};

// Dynamically load a theme on demand via shiki/themes
export const ensureTheme = async (highlighter: HighlighterCore, theme: string) => {
  if (highlighter.getLoadedThemes().includes(theme)) return;
  if (theme === 'lobe-theme') {
    await highlighter.loadTheme(lobeTheme as any);
    return;
  }
  try {
    const { bundledThemes } = await import('shiki/themes');
    const loader = bundledThemes[theme as keyof typeof bundledThemes];
    if (loader) {
      await highlighter.loadTheme(await loader());
    }
  } catch {
    // Theme not found
  }
};

// Main highlight hook
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

  // Lazy-load transformers to avoid static @shikijs/transformers import
  const [transformers, setTransformers] = useState<any[] | undefined>();
  useEffect(() => {
    if (!enableTransformer) {
      setTransformers(undefined);
      return;
    }
    import('@shikijs/transformers').then((mod) => {
      setTransformers([
        mod.transformerNotationDiff(),
        mod.transformerNotationHighlight(),
        mod.transformerNotationWordHighlight(),
        mod.transformerNotationFocus(),
        mod.transformerNotationErrorLevel(),
      ]);
    });
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
    const highlightPromise = (async (): Promise<string> => {
      try {
        const highlighter = await getOrCreateHighlighter();
        if (!highlighter) return safeText;

        const effectiveTheme = builtinTheme || 'lobe-theme';

        // Load language and theme on demand
        await Promise.all([
          ensureLanguage(highlighter, matchedLanguage),
          ensureTheme(highlighter, effectiveTheme),
        ]);

        const html = highlighter.codeToHtml(safeText, {
          lang: matchedLanguage,
          theme: effectiveTheme,
          transformers,
        });

        return html;
      } catch (error_) {
        console.error('Advanced rendering failed:', error_);

        try {
          const highlighter = await getOrCreateHighlighter();
          if (!highlighter) return safeText;
          await Promise.all([
            ensureLanguage(highlighter, matchedLanguage),
            ensureTheme(highlighter, 'lobe-theme'),
          ]);
          const html = highlighter.codeToHtml(safeText, {
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
  }, [cacheKey, safeText, matchedLanguage, builtinTheme, transformers]);

  return data || '';
};
