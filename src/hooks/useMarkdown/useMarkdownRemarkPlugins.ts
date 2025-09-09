'use client';

import { useMemo } from 'react';
import remarkBreaks from 'remark-breaks';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { Pluggable } from 'unified';

import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import { remarkBr } from '@/Markdown/plugins/remarkBr';
import { remarkColor } from '@/Markdown/plugins/remarkColor';
import { remarkCustomFootnotes } from '@/Markdown/plugins/remarkCustomFootnotes';
import { remarkGfmPlus } from '@/Markdown/plugins/remarkGfmPlus';
import { remarkVideo } from '@/Markdown/plugins/remarkVideo';

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
        remarkCjkFriendly,
        [remarkGfm, { singleTilde: false }],
        !allowHtml && remarkBr,
        !allowHtml && remarkGfmPlus,
        !allowHtml && remarkVideo,
        remarkColor,
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
