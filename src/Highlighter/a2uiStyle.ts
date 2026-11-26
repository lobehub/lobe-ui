import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit a2ui-playground (MIT): `renderers/content.tsx` CodeBlock.
export const a2uiCodeStyles = stylex.create({
  body: {
    color: a2ui.fg,
    fontFamily: a2ui.fontFamilyCode,
    fontSize: 12.5,
    lineHeight: 1.65,
  },
  /** Code colour before the highlighter loads (the plain fallback). */
  content: {
    color: a2ui.fg,
  },
  copy: {
    borderRadius: 8,
    borderStyle: 'none',
    gap: 4,
    paddingBlock: 4,
    paddingInline: 6,
    transitionDuration: '150ms',
    transitionProperty: 'color, background-color',
    alignItems: 'center',
    backgroundColor: { 'default': 'transparent', ':hover': a2ui.overlay5 },
    boxShadow: { 'default': null, ':focus-visible': `0 0 0 2px ${a2ui.ring}` },
    color: { 'default': a2ui.fgMuted, ':hover': a2ui.fg },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: a2ui.fontFamily,
    fontSize: 11,
    lineHeight: 1.5,
    outline: 'none',
  },
  dot: {
    borderRadius: 999,
    backgroundColor: a2ui.overlay15,
    height: 8,
    width: 8,
  },
  dots: {
    gap: 4,
    display: 'flex',
  },
  header: {
    borderBlockEndColor: a2ui.line,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    paddingBlock: 8,
    paddingInline: 14,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    margin: 0,
  },
  label: {
    gap: 8,
    alignItems: 'center',
    color: a2ui.fgMuted,
    display: 'flex',
    fontFamily: a2ui.fontFamilyCode,
    fontSize: 11,
    minWidth: 0,
  },
  root: {
    margin: 0,
    minWidth: 0,
    overflow: 'hidden',
    width: '100%',
  },
});
