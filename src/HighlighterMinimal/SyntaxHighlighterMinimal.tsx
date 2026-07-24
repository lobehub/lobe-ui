'use client';

import { cx } from 'antd-style';
import { type CSSProperties, memo } from 'react';

import { variants } from '@/Highlighter/SyntaxHighlighter/style';

import { useMinimalHighlight } from './highlighter';

const escapeHtml = (str: string) =>
  str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

export interface SyntaxHighlighterMinimalProps {
  children: string;
  className?: string;
  language: string;
  style?: CSSProperties;
  variant?: 'filled' | 'outlined' | 'borderless';
}

const SyntaxHighlighterMinimal = memo<SyntaxHighlighterMinimalProps>(
  ({ children, className, language, style, variant = 'borderless' }) => {
    const safeChildren = children ?? '';
    const data = useMinimalHighlight(safeChildren, language);
    const hasData = typeof data === 'string' && data.length > 0;

    const shikiClassName = cx(
      variants({ animated: false, shiki: true, showBackground: false, variant }),
      className,
    );
    const fallbackClassName = cx(
      variants({ animated: false, shiki: false, showBackground: false, variant }),
      className,
    );

    return (
      <div
        className={hasData ? shikiClassName : fallbackClassName}
        dir="ltr"
        style={style}
        dangerouslySetInnerHTML={{
          __html: data || `<pre><code>${escapeHtml(safeChildren)}</code></pre>`,
        }}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children && prevProps.language === nextProps.language,
);

SyntaxHighlighterMinimal.displayName = 'SyntaxHighlighterMinimal';

export default SyntaxHighlighterMinimal;
