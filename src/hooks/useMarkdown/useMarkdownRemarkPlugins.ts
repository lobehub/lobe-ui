'use client';

import { useMemo } from 'react';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { Pluggable } from 'unified';

import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import { remarkCustomFootnotes } from '@/Markdown/plugins/footnote';

export const useMarkdownRemarkPlugins = (): Pluggable[] => {
  const {
    enableLatex,
    enableCustomFootnotes,
    remarkPlugins = [],
    remarkPluginsAhead = [],
    variant,
  } = useMarkdownContext();

  const isChatMode = variant === 'chat';

  const memoPlugins = useMemo(
    () =>
      [
        [remarkGfm, { singleTilde: false }],
        enableLatex && remarkMath,
        enableCustomFootnotes && remarkCustomFootnotes,
        isChatMode && remarkBreaks,
      ].filter(Boolean) as Pluggable[],
    [isChatMode, enableLatex, enableCustomFootnotes],
  );

  return useMemo(
    () => [...remarkPluginsAhead, ...memoPlugins, ...remarkPlugins],
    [remarkPlugins, memoPlugins, remarkPluginsAhead],
  );
};
