import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `Slider` and the `.a2ui-std-range`
// rules of the standard stylesheet: a 24px pill track with no filled range, and a 20px thumb
// inset 2px, over a row with the label and the value.
export const styles = stylex.create({
  control: {
    borderRadius: 9999,
    paddingInline: 12,
    alignItems: 'center',
    backgroundColor: a2ui.overlay4,
    boxSizing: 'border-box',
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'flex',
    opacity: { 'default': null, ':is([data-disabled])': 0.5 },
    height: 24,
    width: '100%',
  },
  header: {
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    fontSize: '0.875em',
    justifyContent: 'space-between',
    lineHeight: 1.429,
  },
  indicator: {
    display: 'none',
  },
  label: {
    color: a2ui.fgMuted,
    fontWeight: 500,
  },
  root: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: '100%',
  },
  thumb: {
    borderColor: a2ui.line,
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
    outlineColor: { 'default': null, ':has(:focus-visible)': a2ui.info },
    outlineOffset: { 'default': null, ':has(:focus-visible)': 1 },
    outlineStyle: { 'default': null, ':has(:focus-visible)': 'solid' },
    outlineWidth: { 'default': null, ':has(:focus-visible)': 2 },
    backgroundColor: a2ui.surface2,
    boxShadow: a2ui.shadowXs,
    boxSizing: 'border-box',
    height: 20,
    width: 20,
  },
  track: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  value: {
    color: a2ui.fg,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
  },
});
