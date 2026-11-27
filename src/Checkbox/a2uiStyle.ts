import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `CheckBox` and the `.a2ui-std-check`
// rules of the standard stylesheet: a 20px box (round by default), filled with the accent and a
// 14px check when checked.
const checked = ':is([data-checked], [data-indeterminate])';

export const styles = stylex.create({
  box: {
    margin: 0,
    padding: 0,
    borderColor: { default: a2ui.lineStrong, [checked]: a2ui.accent },
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
    outlineColor: { 'default': null, ':focus-visible': a2ui.info },
    outlineOffset: { 'default': null, ':focus-visible': 1 },
    outlineStyle: { 'default': null, ':focus-visible': 'solid' },
    outlineWidth: { 'default': null, ':focus-visible': 2 },
    alignItems: 'center',
    backgroundColor: { default: a2ui.surface2, [checked]: a2ui.accent },
    boxSizing: 'border-box',
    color: a2ui.primaryFg,
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    height: 20,
    width: 20,
  },
  boxSquare: {
    borderRadius: 6,
  },
  indicator: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  label: {
    gap: 8,
    alignItems: 'center',
    color: a2ui.fg,
    cursor: { 'default': 'pointer', ':has([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    fontSize: '1em',
    lineHeight: 1.625,
    opacity: { 'default': null, ':has([data-disabled])': 0.5 },
    userSelect: 'none',
  },
  root: {
    fontSize: 'inherit',
  },
  standalone: {
    opacity: { 'default': null, ':is([data-disabled])': 0.5 },
  },
});
