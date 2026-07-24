'use client';

import { useThemeMode } from 'antd-style';
import { renderMermaidSVG, type RenderOptions, type ThemeName, THEMES } from 'beautiful-mermaid';
import { useEffect, useId, useMemo, useState } from 'react';

import { prepareInlineMermaidSvg } from '@/Mermaid/SyntaxMermaid/prepareInlineSvg';

import { createCdnMermaidConfig, renderWithCdnMermaid } from './useMermaidCdn';

export type MermaidThemeName = 'lobe-theme' | ThemeName;

export interface MermaidRenderResult {
  error?: string;
  loading?: boolean;
  svg: string;
}

/**
 * beautiful-mermaid emits these as CSS custom properties on the SVG root and
 * derives the rest with color-mix(), so pointing them at antd's variables lets
 * the diagram follow the theme through CSS alone — no token subscription, and
 * no re-render (or re-layout) when the appearance changes.
 */
const LOBE_THEME_OPTIONS: RenderOptions = {
  accent: 'var(--ant-color-primary)',
  bg: 'var(--ant-color-bg-container)',
  border: 'var(--ant-color-border)',
  fg: 'var(--ant-color-text)',
  line: 'var(--ant-color-text-secondary)',
  muted: 'var(--ant-color-text-description)',
  surface: 'var(--ant-color-fill-tertiary)',
  transparent: true,
};

const isNamedTheme = (theme?: MermaidThemeName): theme is ThemeName =>
  !!theme && theme !== 'lobe-theme' && theme in THEMES;

export const createMermaidOptions = (customTheme?: MermaidThemeName): RenderOptions =>
  isNamedTheme(customTheme) ? THEMES[customTheme]! : LOBE_THEME_OPTIONS;

/**
 * beautiful-mermaid covers six diagram types; anything else throws here and is
 * handed to the CDN-loaded upstream mermaid instead.
 */
export const renderMermaid = (
  content: string,
  scopeId: string,
  customTheme?: MermaidThemeName,
): MermaidRenderResult => {
  if (!content) return { svg: '' };
  try {
    const svg = renderMermaidSVG(content, createMermaidOptions(customTheme));
    return { svg: prepareInlineMermaidSvg(svg, scopeId) };
  } catch {
    return { error: 'unsupported', svg: '' };
  }
};

export const useCdnMermaidFallback = (
  content: string,
  { enabled, theme: customTheme }: { enabled: boolean; theme?: MermaidThemeName },
): MermaidRenderResult => {
  const { isDarkMode } = useThemeMode();
  const reactId = useId();
  const [result, setResult] = useState<MermaidRenderResult>({ svg: '' });

  useEffect(() => {
    if (!enabled || !content) {
      setResult({ svg: '' });
      return;
    }

    let active = true;
    setResult({ loading: true, svg: '' });

    const config = createCdnMermaidConfig(
      isDarkMode,
      isNamedTheme(customTheme) ? customTheme : undefined,
    );

    renderWithCdnMermaid(content, `mermaid-cdn-${reactId.replaceAll(':', '')}`, config)
      .then((svg) => {
        if (!active) return;
        setResult(svg ? { svg } : { error: 'Failed to render diagram', svg: '' });
      })
      .catch(() => {
        if (active) setResult({ error: 'Failed to render diagram', svg: '' });
      });

    return () => {
      active = false;
    };
  }, [enabled, content, isDarkMode, customTheme, reactId]);

  return result;
};

export const useMermaid = (
  content: string,
  { theme: customTheme }: { theme?: MermaidThemeName } = {},
): MermaidRenderResult => {
  const reactId = useId();
  const scopeId = useMemo(() => `mermaid-${reactId.replaceAll(':', '')}`, [reactId]);

  const primary = useMemo(
    () => renderMermaid(content, scopeId, customTheme),
    [content, scopeId, customTheme],
  );

  const fallback = useCdnMermaidFallback(content, {
    enabled: Boolean(primary.error),
    theme: customTheme,
  });

  return primary.error ? fallback : primary;
};
