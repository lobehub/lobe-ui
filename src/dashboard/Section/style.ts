import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  // `variant="a2ui"`: adapted from CopilotKit a2ui-playground (MIT), `renderers/layout.tsx` Section.
  a2ui: {
    gap: 12,
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  a2uiBody: {
    gap: 12,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  a2uiDesc: {
    margin: 0,
    color: a2ui.fgMuted,
    fontSize: 12.5,
    lineHeight: 1.625,
  },
  a2uiHeader: {
    gap: 4,
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  a2uiHeaderRow: {
    gap: 12,
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    minInlineSize: 0,
  },
  a2uiTitle: {
    margin: 0,
    color: a2ui.fg,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.5,
  },
  a2uiTitleRow: {
    alignItems: 'baseline',
    columnGap: 10,
    display: 'flex',
    flexWrap: 'wrap',
    minInlineSize: 0,
    rowGap: 2,
  },
  desc: {
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.45,
  },
  more: {
    gap: 2,
    textDecoration: 'none',
    alignItems: 'center',
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    display: 'inline-flex',
    fontSize: 13,
  },
  title: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.4,
  },
});
