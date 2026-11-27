'use client';

import type { ThemedToken } from '@pierre/highlights';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { memo, useEffect, useReducer, useRef } from 'react';

import { useStreamHighlight } from '@/hooks/useStreamHighlight';

import { getTokenStyle } from '../tokens';
import {
  createTokenFadeStore,
  getLineFadeEnd,
  markTokenBirths,
  resolveTokenFadeStyle,
  retainCommonPrefix,
  type TokenFadeStore,
} from './tokenFade';

interface StreamRendererProps {
  children: string;
  className?: string;
  dataAttributes?: Record<`data-${string}`, string>;
  fallbackClassName?: string;
  language: string;
  style?: CSSProperties;
  theme?: string;
}

const TokenSpan = memo(
  ({ fadeStyle, token }: { fadeStyle?: CSSProperties | null; token: ThemedToken }) => {
    const style = fadeStyle ? { ...getTokenStyle(token), ...fadeStyle } : getTokenStyle(token);
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
    /**
     * When this line's last fade ends, `0` once nothing in it is fading.
     * Only used to re-render the line when its fades finish.
     */
    fadeEnd: number;
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
  (prev, next) =>
    prev.line === next.line && prev.start === next.start && prev.fadeEnd === next.fadeEnd,
);

const StreamRenderer = memo<StreamRendererProps>(
  ({ children, className, dataAttributes, fallbackClassName, language, style, theme }) => {
    // Safely handle empty or invalid children
    const safeChildren = children ?? '';

    const streaming = useStreamHighlight(safeChildren, {
      language,
      streaming: true,
      theme,
    });

    const lines = streaming?.lines;
    const preStyle = streaming?.preStyle;

    const fadeRef = useRef<TokenFadeStore>(createTokenFadeStore());
    const previousTextRef = useRef('');
    if (!safeChildren.startsWith(previousTextRef.current)) {
      retainCommonPrefix(fadeRef.current, previousTextRef.current, safeChildren);
    }
    previousTextRef.current = safeChildren;
    const now = performance.now();
    const lineStarts = lines ? markTokenBirths(fadeRef.current, lines, now) : [];

    // Refold: a token span keeps `.stream-char` and its CSS animation only
    // until its fade ends. Lines are memoized, so once a line stops changing
    // nothing would re-render it and every finished token would hold a
    // `forwards` animation for the rest of the reply. Wake up when the
    // earliest pending line fade ends and re-render only the lines whose
    // `fadeEnd` changed (same idea as streamdown's `StreamTail` refold).
    const [, refold] = useReducer((count: number) => count + 1, 0);
    const lineFadeEnds = lines
      ? lines.map((line, index) => getLineFadeEnd(fadeRef.current, line, lineStarts[index], now))
      : [];
    let nextRefoldAt = Infinity;
    for (const end of lineFadeEnds) if (end > 0 && end < nextRefoldAt) nextRefoldAt = end;

    useEffect(() => {
      if (!Number.isFinite(nextRefoldAt)) return;
      const timer = setTimeout(
        refold,
        Math.max(0, Math.ceil(nextRefoldAt - performance.now()) + 1),
      );
      return () => clearTimeout(timer);
    }, [nextRefoldAt]);

    if (!lines || lines.length === 0) {
      return (
        <div {...dataAttributes} className={fallbackClassName} dir="ltr" style={style}>
          <pre>
            <code>{safeChildren}</code>
          </pre>
        </div>
      );
    }

    return (
      <div {...dataAttributes} className={className} dir="ltr" style={style}>
        <pre className={clsx('shiki', theme)} style={preStyle} tabIndex={0}>
          <code style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'pre' }}>
            {lines.map((line, index) => (
              <TokenLine
                fade={fadeRef.current}
                fadeEnd={lineFadeEnds[index]}
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
