import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT), `standard/data.tsx` List, ListItem
// and ItemBody. Sizes are in em: like the official list, the a2ui variant takes the font size of
// the text around it.
export const styles = stylex.create({
  actions: {
    gap: 4,
    alignItems: 'center',
    display: 'inline-flex',
    flex: 'none',
    alignSelf: 'center',
  },
  body: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    minWidth: 0,
  },
  /** A pickable row: no box, the full row is the hit area. */
  button: {
    font: 'inherit',
    borderRadius: 4,
    borderStyle: 'none',
    borderWidth: 0,
    margin: 0,
    padding: 0,
    textAlign: 'start',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'pointer',
    display: 'block',
    textDecoration: 'none',
    width: '100%',
  },
  buttonDisabled: {
    cursor: 'default',
  },
  children: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  connector: {
    borderInlineStartColor: a2ui.line,
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    paddingInlineStart: 12,
  },
  description: {
    color: a2ui.fgMuted,
    fontSize: '0.875em',
    lineHeight: 1.429,
  },
  disabled: {
    opacity: 0.5,
  },
  divider: {
    marginBlock: 4,
    backgroundColor: a2ui.line,
    height: 1,
    listStyleType: 'none',
  },
  horizontal: {
    gap: 12,
    flexDirection: 'row',
    listStyleType: 'none',
    overflowX: 'auto',
  },
  hideMarker: {
    listStyleType: 'none',
  },
  labelLine: {
    gap: 12,
    alignItems: 'baseline',
    color: a2ui.fg,
    display: 'flex',
    fontSize: '1em',
    justifyContent: 'space-between',
    lineHeight: 1.625,
  },
  marker: {
    paddingTop: 2,
    alignItems: 'center',
    color: a2ui.fgMuted,
    display: 'flex',
    flex: 'none',
    justifyContent: 'center',
    minWidth: 20,
  },
  native: {
    paddingInlineStart: '1.5em',
  },
  root: {
    margin: 0,
    padding: 0,
    gap: 4,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'block',
  },
  rowLeading: {
    gap: 8,
    alignItems: 'flex-start',
    display: 'flex',
  },
  value: {
    flex: 'none',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    textAlign: 'end',
  },
});

export const markerStyles = stylex.create({
  bullet: { listStyleType: 'disc' },
  none: { listStyleType: 'none' },
  number: { listStyleType: 'decimal' },
  rich: { listStyleType: 'none' },
});
