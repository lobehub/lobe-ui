'use client';

import { useMemo, useRef, useState } from 'react';

import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';

import { isLastFormulaRenderable } from './latex';
import { addToCache, contentCache, preprocessContent } from './utils';

export const useMarkdownContent = (children: string): string | undefined => {
  const { animated, enableLatex = true, enableCustomFootnotes, citations } = useMarkdownContext();
  const [validContent, setValidContent] = useState<string>('');
  const prevProcessedContent = useRef<string>('');

  const citationsLength = citations?.length || 0;

  // Calculate cache key with fewer string concatenations and better performance
  const cacheKey = useMemo(
    () => `${children}|${enableLatex ? 1 : 0}|${enableCustomFootnotes ? 1 : 0}|${citationsLength}`,
    [children, enableLatex, enableCustomFootnotes, citationsLength],
  );

  // Process content and use cache to avoid repeated calculations
  return useMemo(() => {
    // Try to get from cache first for best performance
    if (contentCache.has(cacheKey)) {
      return contentCache.get(cacheKey);
    }

    // Process new content only if needed
    let processedContent = preprocessContent(children, {
      animated,
      citationsLength,
      enableCustomFootnotes,
      enableLatex,
    });

    // Special handling for LaTeX content when animated
    if (animated && enableLatex) {
      const isRenderable = isLastFormulaRenderable(processedContent);
      if (!isRenderable && validContent) {
        processedContent = validContent;
      }
    }

    // Only update state if content changed (prevents unnecessary re-renders)
    if (processedContent !== prevProcessedContent.current) {
      setValidContent(processedContent);
      prevProcessedContent.current = processedContent;
    }

    // Cache the processed result
    addToCache(cacheKey, processedContent);
    return processedContent;
  }, [
    cacheKey,
    children,
    enableLatex,
    enableCustomFootnotes,
    citationsLength,
    animated,
    validContent,
  ]);
};
