import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `Form` (a column 16px apart),
// `Field` (label over control) and a `Row` of `Button`s at the end for the submit row.
export const styles = stylex.create({
  block: {
    flex: '1',
  },
  extra: {
    color: a2ui.fgMuted,
    fontSize: '0.8125em',
    lineHeight: 1.4,
  },
  required: {
    marginInlineStart: 2,
    color: cssVar.colorError,
  },
  root: {
    gap: 16,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    minWidth: 0,
  },
  submitRow: {
    gap: 8,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
});
