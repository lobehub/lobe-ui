'use client';

import { getTokenStyleObject } from '@shikijs/core';
import { cx } from 'antd-style';
import type { CSSProperties } from 'react';
import { memo } from 'react';
import type { BuiltinTheme, ThemedToken } from 'shiki';

import { useStreamHighlight } from '@/hooks/useStreamHighlight';

interface StreamRendererProps {
  children: string;
  className?: string;
  enableTransformer?: boolean;
  fallbackClassName?: string;
  language: string;
  style?: CSSProperties;
  theme?: BuiltinTheme;
}

const normalizeStyleKeys = (style: Record<string, string | number>): CSSProperties => {
  const normalized: CSSProperties = {};
  Object.entries(style).forEach(([key, value]) => {
    const normalizedKey = key.replaceAll(/-([a-z])/g, (_, char) => char.toUpperCase());
    (normalized as Record<string, string | number>)[normalizedKey] = value;
  });
  return normalized;
};

const getTokenInlineStyle = (token: ThemedToken): CSSProperties => {
  const rawStyle = token.htmlStyle || getTokenStyleObject(token);
  const baseStyle = normalizeStyleKeys(rawStyle);
  return { ...baseStyle, whiteSpace: 'pre' };
};

const TokenSpan = memo(
  ({ token }: { token: ThemedToken }) => {
    return (
      <span key={token.content} style={getTokenInlineStyle(token)}>
        {token.content}
      </span>
    );
  },
  (prev, next) => prev.token === next.token,
);

const TokenLine = memo(
  ({ line }: { line: ThemedToken[] }) => {
    if (!line.length) {
      return (
        <span className="line">
          <span style={{ whiteSpace: 'pre' }}>{'\u00A0'}</span>
        </span>
      );
    }

    return (
      <span className="line">
        {line.map((token, tokenIndex) => (
          <TokenSpan key={`token-${tokenIndex}`} token={token} />
        ))}
      </span>
    );
  },
  (prev, next) => prev.line === next.line,
);

const StreamRenderer = memo<StreamRendererProps>(
  ({ children, className, enableTransformer, fallbackClassName, language, style, theme }) => {
    // Safely handle empty or invalid children
    const safeChildren = children ?? '';

    const streaming = useStreamHighlight(safeChildren, {
      enableTransformer,
      language,
      streaming: true,
      theme,
    });

    const lines = streaming?.lines;
    const preStyle = streaming?.preStyle;

    if (!lines || lines.length === 0) {
      return (
        <div className={fallbackClassName} dir="ltr" style={style}>
          <pre>
            <code>{safeChildren}</code>
          </pre>
        </div>
      );
    }

    return (
      <div className={className} dir="ltr" style={style}>
        <pre className={cx('shiki', theme)} style={preStyle} tabIndex={0}>
          <code style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'pre' }}>
            {lines.map((line, index) => (
              <TokenLine key={`line-${index}`} line={line} />
            ))}
          </code>
        </pre>
      </div>
    );
  },
);

StreamRenderer.displayName = 'StreamRenderer';

export default StreamRenderer;
