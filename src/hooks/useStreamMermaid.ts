'use client';

import { useEffect, useId, useMemo, useState } from 'react';

import {
  type MermaidRenderResult,
  type MermaidThemeName,
  renderMermaid,
  useCdnMermaidFallback,
} from './useMermaid';

const EMPTY: MermaidRenderResult = { svg: '' };

export const useStreamMermaid = (
  content: string,
  {
    enabled = true,
    theme: customTheme,
  }: {
    enabled?: boolean;
    theme?: MermaidThemeName;
  },
): MermaidRenderResult => {
  const reactId = useId();
  const scopeId = useMemo(() => `mermaid-${reactId.replaceAll(':', '')}`, [reactId]);
  const [primary, setPrimary] = useState<MermaidRenderResult>(EMPTY);

  useEffect(() => {
    if (!enabled || !content) {
      setPrimary(EMPTY);
      return;
    }

    // Debounce rendering so streaming content only re-renders after it settles
    const timer = setTimeout(() => {
      setPrimary(renderMermaid(content, scopeId, customTheme));
    }, 300);

    return () => clearTimeout(timer);
  }, [enabled, content, scopeId, customTheme]);

  const fallback = useCdnMermaidFallback(content, {
    enabled: enabled && Boolean(primary.error),
    theme: customTheme,
  });

  return primary.error ? fallback : primary;
};
