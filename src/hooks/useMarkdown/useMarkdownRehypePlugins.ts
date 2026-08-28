'use client';

import { useMemo } from 'react';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import rehypeRaw from 'rehype-raw';
import type { Pluggable } from 'unified';

import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import { rehypeCustomFootnotes } from '@/Markdown/plugins/rehypeCustomFootnotes';
import { rehypeKatex } from '@/Markdown/plugins/rehypeKatex';
import { rehypeKatexDir } from '@/Markdown/plugins/rehypeKatexDir';

export const useMarkdownRehypePlugins = (): Pluggable[] => {
  const {
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
      ].filter(Boolean) as Pluggable[],
    [enableLatex, enableGithubAlert, enableCustomFootnotes, allowHtml],
  );

  return useMemo(
    () => [...rehypePluginsAhead, ...memoPlugins, ...rehypePlugins],
    [rehypePlugins, memoPlugins, rehypePluginsAhead],
  );
};
