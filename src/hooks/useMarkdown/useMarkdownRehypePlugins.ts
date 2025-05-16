'use client';

import { useMemo } from 'react';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import type { Pluggable } from 'unified';

import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import { animatedPlugin } from '@/Markdown/plugins/animated';
import { rehypeFootnoteLinks } from '@/Markdown/plugins/footnote';
import { rehypeKatexDir } from '@/Markdown/plugins/katexDir';

export const useMarkdownRehypePlugins = (): Pluggable[] => {
  const {
    animated,
    enableLatex,
    enableCustomFootnotes,
    allowHtml,
    rehypePlugins = [],
    rehypePluginsAhead = [],
  } = useMarkdownContext();

  const memoPlugins = useMemo(
    () =>
      [
        allowHtml && rehypeRaw,
        enableLatex && rehypeKatex,
        enableLatex && rehypeKatexDir,
        enableCustomFootnotes && rehypeFootnoteLinks,
        animated && animatedPlugin,
      ].filter(Boolean) as Pluggable[],
    [animated, enableLatex, enableCustomFootnotes, allowHtml],
  );

  return useMemo(
    () => [...rehypePluginsAhead, ...memoPlugins, ...rehypePlugins],
    [rehypePlugins, memoPlugins, rehypePluginsAhead],
  );
};
