'use client';

import { useMemo } from 'react';

import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';

import { addToCache, contentCache, preprocessMarkdownContent } from './utils';

export const useMarkdownContent = (children: string): string | undefined => {
  const { enableLatex = true, enableCustomFootnotes, citations } = useMarkdownContext();

  const citationsLength = citations?.length || 0;

  const cacheKey = useMemo(
    () => `${children}|${enableLatex ? 1 : 0}|${enableCustomFootnotes ? 1 : 0}|${citationsLength}`,
    [children, enableLatex, enableCustomFootnotes, citationsLength],
  );

  return useMemo(() => {
    if (contentCache.has(cacheKey)) {
      return contentCache.get(cacheKey);
    }

    const processedContent = preprocessMarkdownContent(children, {
      citationsLength,
      enableCustomFootnotes,
      enableLatex,
    });

    addToCache(cacheKey, processedContent);
    return processedContent;
  }, [cacheKey, children, enableLatex, enableCustomFootnotes, citationsLength]);
};
