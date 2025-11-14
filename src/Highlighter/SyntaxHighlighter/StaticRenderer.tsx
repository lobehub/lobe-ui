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

/**
 * Static renderer for syntax highlighting without animation
 * Uses useHighlight hook to generate HTML and renders it directly
 */
const StaticRenderer = memo<StaticRendererProps>(
  ({ children, className, enableTransformer, fallbackClassName, language, style, theme }) => {
    const { data } = useHighlight(children, {
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
          __html: data || `<pre><code>${children}</code></pre>`,
        }}
        dir="ltr"
        style={style}
      />
    );
  },
);

StaticRenderer.displayName = 'StaticRenderer';

export default StaticRenderer;
