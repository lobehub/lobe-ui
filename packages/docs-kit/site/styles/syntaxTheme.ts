import { cssVar } from 'antd-style';
import type { CSSProperties } from 'react';

/**
 * Token colors for surfaces that cannot run Shiki (the live Prism editor, and
 * any hand-painted span). They follow `src/Highlighter/theme/lobe-theme.ts`.
 */
export const lobeSyntax = {
  boolean: cssVar.purple10,
  comment: cssVar.colorTextQuaternary,
  function: cssVar.geekblue10,
  keyword: cssVar.colorInfo,
  number: cssVar.volcano10,
  plain: cssVar.colorText,
  property: cssVar.volcano10,
  punctuation: cssVar.colorInfo,
  storage: cssVar.purple10,
  string: cssVar.colorSuccess,
  type: cssVar.colorWarning,
} as const;

/** Same fill as `Highlighter` `variant="filled"`. */
export const lobeCodeSurface = cssVar.colorFillQuaternary;

interface PrismTokenStyle {
  style: CSSProperties;
  types: string[];
}

export const lobePrismTheme = {
  plain: {
    backgroundColor: 'transparent',
    color: lobeSyntax.plain,
  },
  styles: [
    {
      style: { color: lobeSyntax.comment, fontStyle: 'italic' },
      types: ['comment', 'prolog', 'doctype', 'cdata'],
    },
    {
      style: { color: lobeSyntax.punctuation },
      types: ['punctuation', 'operator'],
    },
    {
      style: { color: lobeSyntax.keyword },
      types: ['keyword', 'atrule'],
    },
    {
      style: { color: lobeSyntax.boolean },
      types: ['boolean', 'important'],
    },
    {
      style: { color: lobeSyntax.function },
      types: ['function'],
    },
    {
      style: { color: lobeSyntax.type },
      types: ['class-name', 'tag', 'builtin', 'selector'],
    },
    {
      style: { color: lobeSyntax.storage },
      types: ['attr-name'],
    },
    {
      style: { color: lobeSyntax.string },
      types: ['string', 'char', 'url', 'attr-value', 'inserted'],
    },
    {
      style: { color: lobeSyntax.number },
      types: ['number', 'constant'],
    },
    {
      style: { color: lobeSyntax.property },
      types: ['property', 'regex'],
    },
    {
      style: { color: lobeSyntax.plain },
      types: ['plain-text'],
    },
  ] satisfies PrismTokenStyle[],
};
