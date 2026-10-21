'use client';

import { type CSSProperties, memo } from 'react';

import { useHighlight } from '@/hooks/useHighlight';

import { escapeHtml } from '../tokens';

interface StaticRendererProps {
  children: string;
  className?: string;
  dataAttributes?: Record<`data-${string}`, string>;
  fallbackClassName?: string;
  language: string;
  style?: CSSProperties;
  theme?: string;
}

/**
 * Static renderer for syntax highlighting without animation
 * Uses useHighlight hook to generate HTML and renders it directly
 */
const StaticRenderer = memo<StaticRendererProps>(
  ({ children, className, dataAttributes, fallbackClassName, language, style, theme }) => {
    // Safely handle empty or invalid children
    const safeChildren = children ?? '';

    const data = useHighlight(safeChildren, {
      language,
      theme,
    });

    const hasData = typeof data === 'string' && data.length > 0;
    const containerClassName = hasData ? className : fallbackClassName;

    return (
      <div
        {...dataAttributes}
        className={containerClassName}
        dir="ltr"
        style={style}
        dangerouslySetInnerHTML={{
          __html: data || `<pre><code>${escapeHtml(safeChildren)}</code></pre>`,
        }}
      />
    );
  },
);

StaticRenderer.displayName = 'StaticRenderer';

export default StaticRenderer;
