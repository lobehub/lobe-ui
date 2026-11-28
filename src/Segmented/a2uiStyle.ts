import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `SegmentedControl` (`segmentStyle`
// at size lg, pill): a 2px-padded well of 32px segments; the chosen one is a raised surface.
export const styles = stylex.create({
  item: {
    font: 'inherit',
    borderRadius: 9999,
    borderStyle: 'none',
    borderWidth: 0,
    gap: 6,
    margin: 0,
    paddingBlock: 0,
    paddingInline: 12,
    outlineColor: { 'default': null, ':focus-visible': a2ui.info },
    outlineOffset: { 'default': null, ':focus-visible': 1 },
    outlineStyle: { 'default': null, ':focus-visible': 'solid' },
    outlineWidth: { 'default': null, ':focus-visible': 2 },
    alignItems: 'center',
    backgroundColor: { 'default': 'transparent', ':is([data-pressed])': a2ui.surface },
    boxShadow: { 'default': null, ':is([data-pressed])': a2ui.shadowXs },
    color: { 'default': a2ui.fgMuted, ':is([data-pressed])': a2ui.fg },
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    fontSize: '0.875em',
    fontWeight: 500,
    justifyContent: 'center',
    lineHeight: 1.5,
    minHeight: 32,
  },
  itemBlock: {
    flex: '1',
  },
  root: {
    gap: 2,
    padding: 2,
    borderRadius: 9999,
    backgroundColor: a2ui.secondary,
    boxSizing: 'border-box',
    display: 'inline-flex',
    maxWidth: '100%',
  },
  rootBlock: {
    display: 'flex',
    width: '100%',
  },
  rootDisabled: {
    opacity: 0.5,
  },
});
