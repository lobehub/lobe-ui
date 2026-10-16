import type { CSSProperties } from 'react';

/**
 * Token colors for surfaces that cannot run Shiki (the live Prism editor, and
 * any hand-painted span). They follow `src/Highlighter/theme/lobe-theme.ts`.
 */
export const lobeSyntax = {
  boolean: 'var(--lobe-purple-10)',
  comment: 'var(--lobe-color-text-quaternary)',
  function: 'var(--lobe-geekblue-10)',
  keyword: 'var(--lobe-color-info)',
  number: 'var(--lobe-volcano-10)',
  plain: 'var(--lobe-color-text)',
  property: 'var(--lobe-volcano-10)',
  punctuation: 'var(--lobe-color-info)',
  storage: 'var(--lobe-purple-10)',
  string: 'var(--lobe-color-success)',
  type: 'var(--lobe-color-warning)',
} as const;

/** Same fill as `Highlighter` `variant="filled"`. */
export const lobeCodeSurface = 'var(--lobe-color-fill-quaternary)';

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
