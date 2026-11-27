import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/inputs.tsx` ChipSelect (a shadcn
// `ToggleGroup type="multiple"`). The `d*` entries restyle the same markup for `variant="default"`.
export const styles = stylex.create({
  a2uiChip: {
    borderColor: a2ui.overlay12,
    borderRadius: 9999,
    paddingInline: 12,
    backgroundColor: { 'default': a2ui.overlay2, ':hover:not(:disabled)': a2ui.overlay5 },
    color: a2ui.fg80,
    fontSize: 12.5,
    fontWeight: 500,
    height: 28,
  },
  a2uiChipOn: {
    borderColor: a2ui.accent50,
    backgroundColor: { 'default': a2ui.accent14, ':hover:not(:disabled)': a2ui.accent14 },
    color: a2ui.accent,
  },
  a2uiCount: {
    color: a2ui.fgMuted,
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
  },
  chip: {
    font: 'inherit',
    margin: 0,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 4,
    outline: 'none',
    alignItems: 'center',
    boxShadow: { 'default': null, ':focus-visible': `0 0 0 3px ${a2ui.ring}` },
    boxSizing: 'border-box',
    cursor: { 'default': 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    lineHeight: 1.5,
    opacity: { 'default': null, ':disabled': 0.5 },
    transitionDuration: '150ms',
    transitionProperty: 'color, background-color, border-color',
    whiteSpace: 'nowrap',
    minWidth: 32,
  },
  chips: {
    gap: 6,
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dChip: {
    borderColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
    borderRadius: cssVar.borderRadius,
    paddingInline: 10,
    backgroundColor: {
      'default': cssVar.colorBgContainer,
      ':hover:not(:disabled)': cssVar.colorFillTertiary,
    },
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSize,
    height: 28,
  },
  dChipOn: {
    borderColor: cssVar.colorBorder,
    backgroundColor: {
      'default': cssVar.colorFillSecondary,
      ':hover:not(:disabled)': cssVar.colorFill,
    },
    color: cssVar.colorText,
  },
  dCount: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
    fontVariantNumeric: 'tabular-nums',
  },
});
