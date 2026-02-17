'use client';

import { useMemo } from 'react';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import type { Pluggable } from 'unified';

import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import { rehypeCustomFootnotes } from '@/Markdown/plugins/rehypeCustomFootnotes';
import { rehypeKatexDir } from '@/Markdown/plugins/rehypeKatexDir';
import { rehypeStreamAnimated } from '@/Markdown/plugins/rehypeStreamAnimated';
import { STREAM_ANIMATION_REHYPE_FALLBACK } from '@/Markdown/SyntaxMarkdown/streamAnimation.constants';

export const useMarkdownRehypePlugins = (): Pluggable[] => {
  const {
    animated,
    enableLatex,
    enableCustomFootnotes,
    enableGithubAlert,
    allowHtml,
    rehypePlugins = [],
    rehypePluginsAhead = [],
  } = useMarkdownContext();

  const memoPlugins = useMemo(
    () =>
      [
        allowHtml && rehypeRaw,
        enableGithubAlert && rehypeGithubAlerts,
        enableLatex && rehypeKatex,
        enableLatex && rehypeKatexDir,
        enableCustomFootnotes && rehypeCustomFootnotes,
        animated && [rehypeStreamAnimated, STREAM_ANIMATION_REHYPE_FALLBACK],
      ].filter(Boolean) as Pluggable[],
    [animated, enableLatex, enableGithubAlert, enableCustomFootnotes, allowHtml],
  );

  return useMemo(
    () => [...rehypePluginsAhead, ...memoPlugins, ...rehypePlugins],
    [rehypePlugins, memoPlugins, rehypePluginsAhead],
  );
};
