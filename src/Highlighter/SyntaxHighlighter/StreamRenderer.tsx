'use client';

import { getTokenStyleObject } from '@shikijs/core';
import type { CSSProperties } from 'react';
import { memo } from 'react';
import type { BuiltinTheme, ThemedToken } from 'shiki';

import { useHighlight } from '@/hooks/useHighlight';

import { useStyles } from './style';

interface StreamRendererProps {
  children: string;
  className?: string;
  enableTransformer?: boolean;
  fallbackClassName?: string;
  language: string;
  style?: CSSProperties;
  theme?: BuiltinTheme;
}

const applyColorReplacement = (color?: string, replacements?: Record<string, string>) => {
  if (!color || !replacements) return color;
  return replacements[color.toLowerCase()] || color;
};

const normalizeStyleKeys = (style: Record<string, string | number>): CSSProperties => {
  const normalized: CSSProperties = {};
  Object.entries(style).forEach(([key, value]) => {
    const normalizedKey = key.replaceAll(/-([a-z])/g, (_, char) => char.toUpperCase());
    (normalized as Record<string, string | number>)[normalizedKey] = value;
  });
  return normalized;
};

const getTokenInlineStyle = (
  token: ThemedToken,
  replacements?: Record<string, string>,
): CSSProperties => {
  const rawStyle = token.htmlStyle || getTokenStyleObject(token);
  const baseStyle = normalizeStyleKeys(rawStyle);
  if (!replacements) return { ...baseStyle, whiteSpace: 'pre' };

  const style: CSSProperties = {
    ...baseStyle,
    whiteSpace: 'pre',
  };

  if (style.color && typeof style.color === 'string') {
    style.color = applyColorReplacement(style.color, replacements);
  }
  if (style.backgroundColor && typeof style.backgroundColor === 'string') {
    style.backgroundColor = applyColorReplacement(style.backgroundColor, replacements);
  }

  return style;
};

const TokenSpan = memo(
  ({ token, replacements }: { replacements?: Record<string, string>; token: ThemedToken }) => {
    return (
      <span key={token.content} style={getTokenInlineStyle(token, replacements)}>
        {token.content}
      </span>
    );
  },
  (prev, next) => prev.token === next.token,
);

const TokenLine = memo(
  ({ line, replacements }: { line: ThemedToken[]; replacements?: Record<string, string> }) => {
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
          <TokenSpan key={`token-${tokenIndex}`} replacements={replacements} token={token} />
        ))}
      </span>
    );
  },
  (prev, next) => prev.line === next.line,
);

const StreamRenderer = memo<StreamRendererProps>(
  ({ children, className, enableTransformer, fallbackClassName, language, style, theme }) => {
    const { cx } = useStyles();
    const { streaming } = useHighlight(children, {
      enableTransformer,
      language,
      streaming: true,
      theme,
    });

    const lines = streaming?.lines;
    const preStyle = streaming?.preStyle;
    const replacements = streaming?.colorReplacements;

    if (!lines || lines.length === 0) {
      return (
        <div className={fallbackClassName} dir="ltr" style={style}>
          <pre>
            <code>{children}</code>
          </pre>
        </div>
      );
    }

    return (
      <div className={className} dir="ltr" style={style}>
        <pre className={cx('shiki', theme)} style={preStyle} tabIndex={0}>
          <code style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'pre' }}>
            {lines.map((line, index) => (
              <TokenLine key={`line-${index}`} line={line} replacements={replacements} />
            ))}
          </code>
        </pre>
      </div>
    );
  },
);

StreamRenderer.displayName = 'StreamRenderer';

export default StreamRenderer;
