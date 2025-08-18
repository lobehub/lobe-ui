'use client';

import { useMemo } from 'react';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { Pluggable } from 'unified';

import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import { remarkCustomFootnotes } from '@/Markdown/plugins/footnote';
import { remarkBr } from '@/Markdown/plugins/remarkBr';

export const useMarkdownRemarkPlugins = (): Pluggable[] => {
  const {
    enableLatex,
    enableCustomFootnotes,
    remarkPlugins = [],
    remarkPluginsAhead = [],
    variant,
    allowHtml,
  } = useMarkdownContext();

  const isChatMode = variant === 'chat';

  const memoPlugins = useMemo(
    () =>
      [
        !allowHtml && remarkBr,
        [remarkGfm, { singleTilde: false }],
        enableLatex && remarkMath,
        enableCustomFootnotes && remarkCustomFootnotes,
        isChatMode && remarkBreaks,
      ].filter(Boolean) as Pluggable[],
    [allowHtml, isChatMode, enableLatex, enableCustomFootnotes],
  );

  return useMemo(
    () => [...remarkPluginsAhead, ...memoPlugins, ...remarkPlugins],
    [remarkPlugins, memoPlugins, remarkPluginsAhead],
  );
};
