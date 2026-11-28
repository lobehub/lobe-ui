import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/inputs.tsx` ButtonGroup (a shadcn
// `ToggleGroup type="single" spacing={0}`). The `d*` entries restyle it for `variant="default"`.
export const styles = stylex.create({
  a2uiGroup: {
    padding: 2,
    borderColor: a2ui.lineStrong,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: a2ui.overlay2,
  },
  a2uiItem: {
    borderRadius: 8,
    paddingInline: 8,
    backgroundColor: { 'default': 'transparent', ':hover:not(:disabled)': a2ui.muted },
    color: { 'default': a2ui.fgMuted, ':hover:not(:disabled)': a2ui.fg },
    fontSize: 12.5,
    fontWeight: 500,
    height: 28,
  },
  a2uiItemOn: {
    backgroundColor: { 'default': a2ui.surface2, ':hover:not(:disabled)': a2ui.surface2 },
    boxShadow: a2ui.shadowXs,
    color: a2ui.fg,
  },
  dGroup: {
    padding: 2,
    borderRadius: cssVar.borderRadiusLG,
    backgroundColor: cssVar.colorFillTertiary,
  },
  dItem: {
    borderRadius: cssVar.borderRadius,
    paddingInline: 12,
    backgroundColor: {
      'default': 'transparent',
      ':hover:not(:disabled)': cssVar.colorFillSecondary,
    },
    color: { 'default': cssVar.colorTextSecondary, ':hover:not(:disabled)': cssVar.colorText },
    fontSize: cssVar.fontSize,
    height: 28,
  },
  dItemOn: {
    backgroundColor: {
      'default': cssVar.colorBgElevated,
      ':hover:not(:disabled)': cssVar.colorBgElevated,
    },
    boxShadow: cssVar.boxShadowTertiary,
    color: cssVar.colorText,
  },
  group: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    maxWidth: '100%',
    overflowX: 'auto',
    width: 'fit-content',
  },
  item: {
    font: 'inherit',
    margin: 0,
    borderStyle: 'none',
    borderWidth: 0,
    gap: 4,
    outline: 'none',
    alignItems: 'center',
    boxShadow: { 'default': null, ':focus-visible': `0 0 0 3px ${a2ui.ring}` },
    cursor: { 'default': 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    lineHeight: 1.5,
    opacity: { 'default': null, ':disabled': 0.5 },
    transitionDuration: '150ms',
    transitionProperty: 'all',
    whiteSpace: 'nowrap',
    minWidth: 32,
  },
});
