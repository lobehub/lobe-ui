'use client';

import { useMemo } from 'react';

import { getCodeLanguageByInput } from '@/Highlighter/const';
import { DEFAULT_THEME, type HighlighterEngine, useHighlighterEngine } from '@/Highlighter/engine';
import { escapeHtml, tokensToHtml } from '@/Highlighter/tokens';
import { hashString } from '@/utils/hashString';

const MD5_LENGTH_THRESHOLD = 10_000;

const MAX_CACHE_SIZE = 1000;

const highlightCache = new Map<string, string>();

const cacheHtml = (key: string, html: string) => {
  highlightCache.set(key, html);
  if (highlightCache.size > MAX_CACHE_SIZE) {
    const entriesToRemove = Math.floor(MAX_CACHE_SIZE * 0.2);
    for (const staleKey of Array.from(highlightCache.keys()).slice(0, entriesToRemove)) {
      highlightCache.delete(staleKey);
    }
  }
};

const highlightToHtml = (
  { highlights, theme }: HighlighterEngine,
  text: string,
  language: string,
): string => {
  try {
    const result = highlights.codeToTokens(text, { lang: language as any, theme });
    return tokensToHtml(result, theme.name);
  } catch (error) {
    console.error('Syntax highlighting failed:', error);
    return `<pre class="fallback"><code>${escapeHtml(text)}</code></pre>`;
  }
};

export const useHighlight = (
  text: string,
  {
    language,
    theme: themeId,
    streaming,
  }: { language: string; streaming?: boolean; theme?: string },
): string => {
  const safeText = text ?? '';
  const lang = (language ?? 'plaintext').toLowerCase();
  const matchedLanguage = useMemo(() => getCodeLanguageByInput(lang), [lang]);
  const engine = useHighlighterEngine(themeId);

  return useMemo(() => {
    if (streaming || !engine) return '';

    const hash =
      safeText.length < MD5_LENGTH_THRESHOLD
        ? safeText
        : `${safeText.length}:${hashString(safeText)}`;
    const cacheKey = [matchedLanguage, themeId || DEFAULT_THEME, hash].join('-');

    const cached = highlightCache.get(cacheKey);
    if (cached !== undefined) return cached;

    const html = highlightToHtml(engine, safeText, matchedLanguage);
    cacheHtml(cacheKey, html);
    return html;
  }, [engine, matchedLanguage, safeText, streaming, themeId]);
};
