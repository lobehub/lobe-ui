'use client';

import { CSSProperties, memo } from 'react';
import type { BuiltinTheme } from 'shiki';

import { useHighlight } from '@/hooks/useHighlight';

interface StaticRendererProps {
  children: string;
  className?: string;
  enableTransformer?: boolean;
  fallbackClassName?: string;
  language: string;
  style?: CSSProperties;
  theme?: BuiltinTheme;
}

// Escape HTML for fallback to prevent XSS
const escapeHtml = (str: string) =>
  str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

/**
 * Static renderer for syntax highlighting without animation
 * Uses useHighlight hook to generate HTML and renders it directly
 */
const StaticRenderer = memo<StaticRendererProps>(
  ({ children, className, enableTransformer, fallbackClassName, language, style, theme }) => {
    // Safely handle empty or invalid children
    const safeChildren = children ?? '';

    const { data } = useHighlight(safeChildren, {
      enableTransformer,
      language,
      theme,
    });

    const hasData = typeof data === 'string' && data.length > 0;
    const containerClassName = hasData ? className : fallbackClassName;

    return (
      <div
        className={containerClassName}
        dangerouslySetInnerHTML={{
          __html: data || `<pre><code>${escapeHtml(safeChildren)}</code></pre>`,
        }}
        dir="ltr"
        style={style}
      />
    );
  },
);

StaticRenderer.displayName = 'StaticRenderer';

export default StaticRenderer;
