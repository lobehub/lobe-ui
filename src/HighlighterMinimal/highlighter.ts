'use client';

import { useEffect, useState } from 'react';
import type { HighlighterCore } from 'shiki/core';

import lobeTheme from '@/Highlighter/theme/lobe-theme';

let highlighterPromise: Promise<HighlighterCore> | null = null;

const getOrCreateMinimalHighlighter = (): Promise<HighlighterCore> | null => {
  if (typeof window === 'undefined') return null;
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createOnigurumaEngine }, { bundledLanguages }] =
        await Promise.all([
          import('shiki/core'),
          import('shiki/engine/oniguruma'),
          import('shiki/langs'),
        ]);

      const highlighter = await createHighlighterCore({
        engine: createOnigurumaEngine(() => import('shiki/wasm')),
      });

      const presetLangs = [
        'json',
        'javascript',
        'typescript',
        'tsx',
        'jsx',
        'markdown',
        'bash',
        'shellscript',
        'yaml',
        'css',
        'html',
        'python',
      ] as const;

      await Promise.all(
        presetLangs.map(async (id) => {
          const loader = bundledLanguages[id];
          if (loader) {
            await highlighter.loadLanguage(await loader());
          }
        }),
      );

      await highlighter.loadTheme(lobeTheme as any);

      return highlighter;
    })();
  }
  return highlighterPromise;
};

export const useMinimalHighlight = (text: string, language: string): string => {
  const safeText = text ?? '';
  const lang = (language ?? 'plaintext').toLowerCase();

  const [html, setHtml] = useState('');

  useEffect(() => {
    if (!safeText) {
      setHtml('');
      return;
    }

    let cancelled = false;

    (async () => {
      const highlighter = await getOrCreateMinimalHighlighter();
      if (!highlighter || cancelled) return;

      try {
        const loadedLangs = highlighter.getLoadedLanguages();
        const effectiveLang = loadedLangs.includes(lang) ? lang : 'plaintext';

        const result = highlighter.codeToHtml(safeText, {
          lang: effectiveLang,
          theme: 'lobe-theme',
        });

        if (!cancelled) setHtml(result);
      } catch {
        if (!cancelled) setHtml('');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [safeText, lang]);

  return html;
};
