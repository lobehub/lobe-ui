'use client';

import { cx } from 'antd-style';
import type { CSSProperties } from 'react';
import { memo, useRef } from 'react';
import type { BuiltinTheme, ThemedToken } from 'shiki';

import { useStreamHighlight } from '@/hooks/useStreamHighlight';

import {
  createTokenFadeStore,
  markTokenBirths,
  resolveTokenFadeStyle,
  type TokenFadeStore,
} from './tokenFade';

interface StreamRendererProps {
  children: string;
  className?: string;
  enableTransformer?: boolean;
  fallbackClassName?: string;
  language: string;
  style?: CSSProperties;
  theme?: BuiltinTheme;
}

// FontStyle bitmask values from @shikijs/vscode-textmate
const FontStyle = { Bold: 2, Italic: 1, Strikethrough: 8, Underline: 4 } as const;

const getTokenStyleObject = (token: ThemedToken): Record<string, string> => {
  const styles: Record<string, string> = {};
  if (token.color) styles.color = token.color;
  if (token.bgColor) styles['background-color'] = token.bgColor;
  if (token.fontStyle) {
    if (token.fontStyle & FontStyle.Italic) styles['font-style'] = 'italic';
    if (token.fontStyle & FontStyle.Bold) styles['font-weight'] = 'bold';
    const decorations: string[] = [];
    if (token.fontStyle & FontStyle.Underline) decorations.push('underline');
    if (token.fontStyle & FontStyle.Strikethrough) decorations.push('line-through');
    if (decorations.length) styles['text-decoration'] = decorations.join(' ');
  }
  return styles;
};

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
  ({ fadeStyle, token }: { fadeStyle?: CSSProperties | null; token: ThemedToken }) => {
    const style = fadeStyle
      ? { ...getTokenInlineStyle(token), ...fadeStyle }
      : getTokenInlineStyle(token);
    return (
      <span className={fadeStyle ? 'stream-char' : undefined} style={style}>
        {token.content}
      </span>
    );
  },
  (prev, next) => prev.token === next.token && prev.fadeStyle === next.fadeStyle,
);

const TokenLine = memo(
  ({
    fade,
    line,
    now,
    start,
  }: {
    fade: TokenFadeStore;
    line: ThemedToken[];
    now: number;
    start: number;
  }) => {
    if (!line.length) {
      return (
        <span className="line">
          <span style={{ whiteSpace: 'pre' }}>{'\u00A0'}</span>
        </span>
      );
    }

    let offset = start;
    return (
      <span className="line">
        {line.map((token) => {
          const tokenOffset = offset;
          offset += token.content.length;
          return (
            <TokenSpan
              fadeStyle={resolveTokenFadeStyle(fade, tokenOffset, now)}
              key={tokenOffset}
              token={token}
            />
          );
        })}
      </span>
    );
  },
  (prev, next) => prev.line === next.line && prev.start === next.start,
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

    const fadeRef = useRef<TokenFadeStore>(createTokenFadeStore());
    const previousTextRef = useRef('');
    if (!safeChildren.startsWith(previousTextRef.current)) {
      fadeRef.current = createTokenFadeStore();
    }
    previousTextRef.current = safeChildren;
    const now = performance.now();
    const lineStarts = lines ? markTokenBirths(fadeRef.current, lines, now) : [];

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
              <TokenLine
                fade={fadeRef.current}
                key={`line-${index}`}
                line={line}
                now={now}
                start={lineStarts[index]}
              />
            ))}
          </code>
        </pre>
      </div>
    );
  },
);

StreamRenderer.displayName = 'StreamRenderer';

export default StreamRenderer;
