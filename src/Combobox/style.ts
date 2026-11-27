import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit a2ui-playground (MIT): `renderers/inputs.tsx` Combobox (an outline
// shadcn `Button` trigger and a cmdk `Command` in a `Popover`) and shadcn `components/ui/command.tsx`.
// The `d*` entries restyle the same markup for `variant="default"`.
export const styles = stylex.create({
  a2uiItem: {
    borderRadius: 6,
    paddingBlock: 6,
    paddingInline: 8,
    fontSize: 13,
    lineHeight: 1.4286,
  },
  a2uiItemActive: {
    backgroundColor: a2ui.muted,
  },
  a2uiSearch: {
    borderColor: a2ui.overlay5,
    borderRadius: 10,
    backgroundColor: a2ui.overlay5,
    height: 32,
  },
  a2uiSearchInput: {
    fontSize: 13,
    paddingInlineStart: 6,
  },
  a2uiSearchWrap: {
    paddingInline: 4,
    paddingBlockStart: 4,
  },
  a2uiTrigger: {
    borderColor: a2ui.input,
    borderRadius: 10,
    gap: 6,
    paddingInline: 10,
    backgroundColor: { 'default': 'transparent', ':hover:not(:disabled)': a2ui.muted },
    boxShadow: { 'default': null, ':focus-visible': `0 0 0 3px ${a2ui.ring}` },
    color: a2ui.fg,
    fontSize: 13,
    height: 34,
  },
  check: {
    flexShrink: 0,
    marginInlineStart: 'auto',
    opacity: 0,
  },
  checkOn: {
    opacity: 1,
  },
  chevron: {
    color: a2ui.fgMuted,
    flexShrink: 0,
  },
  command: {
    padding: 4,
  },
  dCommand: {
    padding: 4,
  },
  dItem: {
    borderRadius: cssVar.borderRadius,
    paddingBlock: 6,
    paddingInline: 8,
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
  },
  dItemActive: {
    backgroundColor: cssVar.colorFillTertiary,
  },
  dSearch: {
    borderColor: `var(--lobe-fill-border, ${cssVar.colorFill})`,
    borderRadius: cssVar.borderRadius,
    height: 32,
  },
  dSearchInput: {
    fontSize: cssVar.fontSize,
    paddingInlineStart: 6,
  },
  dSearchWrap: {
    paddingInline: 4,
    paddingBlockStart: 4,
  },
  dTrigger: {
    borderColor: cssVar.colorBorder,
    borderRadius: cssVar.borderRadius,
    gap: 8,
    paddingInline: 11,
    backgroundColor: {
      'default': cssVar.colorBgContainer,
      ':hover:not(:disabled)': cssVar.colorBgContainer,
    },
    boxShadow: { 'default': null, ':focus-visible': `0 0 0 2px ${cssVar.colorPrimaryBorder}` },
    color: cssVar.colorText,
    fontFamily: cssVar.fontFamily,
    fontSize: cssVar.fontSize,
    height: 32,
  },
  empty: {
    paddingBlock: 20,
    color: a2ui.fgMuted,
    fontSize: 12.5,
    textAlign: 'center',
  },
  dEmpty: {
    paddingBlock: 20,
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
    textAlign: 'center',
  },
  group: {
    padding: 4,
  },
  item: {
    gap: 8,
    outline: 'none',
    alignItems: 'center',
    color: 'inherit',
    cursor: 'default',
    display: 'flex',
    position: 'relative',
    userSelect: 'none',
  },
  itemDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  list: {
    scrollPaddingBlock: 4,
    maxHeight: 288,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  placeholder: {
    color: a2ui.fgMuted,
  },
  dPlaceholder: {
    color: cssVar.colorTextPlaceholder,
  },
  search: {
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
  },
  searchIcon: {
    flexShrink: 0,
    marginInlineStart: 8,
    opacity: 0.5,
  },
  searchInput: {
    'font': 'inherit',
    'margin': 0,
    'borderStyle': 'none',
    'borderWidth': 0,
    'flex': '1',
    'outline': 'none',
    'paddingBlock': 0,
    'backgroundColor': 'transparent',
    'color': 'inherit',
    'paddingInlineEnd': 8,
    'height': '100%',
    'minWidth': 0,
    '::placeholder': { color: a2ui.fgMuted, opacity: 1 },
  },
  trigger: {
    font: 'inherit',
    margin: 0,
    borderStyle: 'solid',
    borderWidth: 1,
    outline: 'none',
    paddingBlock: 0,
    alignItems: 'center',
    boxSizing: 'border-box',
    cursor: { 'default': 'pointer', ':disabled': 'not-allowed' },
    display: 'flex',
    fontWeight: 400,
    justifyContent: 'space-between',
    lineHeight: 1.5,
    opacity: { 'default': null, ':disabled': 0.5 },
    textAlign: 'start',
    transitionDuration: '150ms',
    transitionProperty: 'background-color, border-color, box-shadow',
    minWidth: 0,
    width: '100%',
  },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
});
