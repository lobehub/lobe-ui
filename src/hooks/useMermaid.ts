'use client';

import { render } from 'pele';
import { useId, useMemo } from 'react';

export type { MermaidThemeName } from '@/Mermaid/themes';

export interface MermaidRenderResult {
  error?: string;
  loading?: boolean;
  svg: string;
}

const FALLBACK_FONT = 'sans-serif';

// pele sizes nodes by measuring labels on a canvas, which cannot resolve var(),
// so the theme font has to be read as a literal before rendering.
const resolveFontFamily = (): string => {
  if (typeof document === 'undefined') return FALLBACK_FONT;
  const value = globalThis
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--lobe-font-family')
    .trim();
  return value || FALLBACK_FONT;
};

export const renderMermaid = (content: string, scopeId: string): MermaidRenderResult => {
  if (!content) return { svg: '' };
  try {
    const { svg } = render(content, {
      fontFamily: resolveFontFamily(),
      fontSize: 14,
      idPrefix: scopeId,
    });
    return { svg };
  } catch (error) {
    return { error: (error as Error).message || 'Failed to render diagram', svg: '' };
  }
};

export const useMermaidScopeId = () => {
  const reactId = useId();
  return useMemo(() => `mermaid-${reactId.replaceAll(':', '')}-`, [reactId]);
};

export const useMermaid = (content: string): MermaidRenderResult => {
  const scopeId = useMermaidScopeId();
  return useMemo(() => renderMermaid(content, scopeId), [content, scopeId]);
};
