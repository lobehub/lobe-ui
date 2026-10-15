import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const disabled = ':is([data-disabled])';
const openOrHighlighted =
  ":is([data-highlighted], [data-state='open'], [data-open], [aria-expanded='true'])";
const dangerHighlight = `${openOrHighlighted}:not(${disabled}, :hover)`;
const dangerActive = `:active:not(${disabled}, ${openOrHighlighted}, :hover)`;
const itemHover = `:hover:not(:active, ${disabled})`;
const itemActive = `:active:not(${disabled}, ${openOrHighlighted})`;
const itemHighlight = `${openOrHighlighted}:not(${disabled})`;
const slotItem = ":has(> [role^='menuitem'])";
const withHeader = ":is([data-has-header], :has(> [data-slot='header']))";
const withFooter = ":is([data-has-footer], :has(> [data-slot='footer']))";
const withVirtual = ':has(> [data-virtual])';
const instantPositioner =
  ":is([data-submenu], [data-nested], [data-side='left'], [data-side='right'])";

export const menuClassNames = {
  icon: 'lobe-menu-icon',
  label: 'lobe-menu-label',
  popup: 'lobe-menu-popup',
  positioner: 'lobe-menu-positioner',
  submenuArrow: 'lobe-menu-submenu-arrow',
} as const;

export const menuStyles = stylex.create({
  danger: {
    '--lobe-menu-icon-color': cssVar.colorError,
    'backgroundColor': {
      [dangerActive]: cssVar.colorFillSecondary,
      [dangerHighlight]: cssVar.colorFillTertiary,
      'default': null,
      ':hover': cssVar.colorErrorBg,
    },
    'color': cssVar.colorError,
  },

  empty: {
    color: { default: cssVar.colorTextTertiary, [disabled]: cssVar.colorTextDisabled },
    cursor: { default: 'default', [disabled]: 'not-allowed' },
    fontStyle: 'italic',
  },

  extra: {
    color: cssVar.colorTextTertiary,
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 12,
    marginInlineStart: 'auto',
    paddingInlineStart: 16,
  },

  footer: {
    paddingBlock: { default: 8, [slotItem]: 4 },
    paddingInline: { default: 12, [slotItem]: 0 },
    borderBlockStartColor: cssVar.colorBorder,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    flexShrink: 0,
  },

  groupLabel: {
    paddingInline: 12,
    color: cssVar.colorTextTertiary,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.6px',
    lineHeight: '14px',
    paddingBlockEnd: 4,
    paddingBlockStart: { 'default': 8, ":is([role='group']:first-child > *)": 4 },
    textTransform: 'uppercase',
    userSelect: 'none',
  },

  header: {
    paddingBlock: { default: 8, [slotItem]: 4 },
    paddingInline: { default: 12, [slotItem]: 0 },
    borderBlockEndColor: cssVar.colorBorder,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    flexShrink: 0,
  },

  icon: {
    alignItems: 'center',
    color: `var(--lobe-menu-icon-color, ${cssVar.colorTextSecondary})`,
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    marginInlineEnd: 12,
    height: 14,
    width: 14,
  },

  iconAlignStart: {
    alignSelf: 'flex-start',
    marginBlockStart: 2,
  },

  item: {
    borderRadius: cssVar.borderRadiusSM,
    outline: 'none',
    overflow: 'hidden',
    paddingBlock: 6,
    paddingInline: 12,
    transition: `all 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: {
      default: null,
      [itemActive]: cssVar.colorFillSecondary,
      [itemHighlight]: cssVar.colorFillTertiary,
      [itemHover]: cssVar.colorFillTertiary,
    },
    color: { default: cssVar.colorText, [disabled]: cssVar.colorTextDisabled },
    cursor: { default: null, [disabled]: 'not-allowed' },
    display: 'flex',
    fontSize: 14,
    lineHeight: '20px',
    opacity: { default: null, [disabled]: 0.5 },
    position: 'relative',
    userSelect: 'none',
    minHeight: 32,
    width: '100%',
  },

  itemContent: {
    flex: '1',
    gap: 0,
    alignItems: 'center',
    display: 'flex',
  },

  itemContentAlignStart: {
    alignItems: 'flex-start',
  },

  label: {
    flex: '1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  labelGroup: {
    flex: '1',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },

  desc: {
    overflow: 'hidden',
    color: cssVar.colorTextTertiary,
    fontSize: 12,
    lineHeight: '16px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  popup: {
    '--lobe-menu-popup-padding': '4px',
    '--lobe-virtual-scroll-inset': {
      default: null,
      [withVirtual]: 'var(--lobe-menu-popup-padding)',
    },
    'borderRadius': cssVar.borderRadius,
    'outline': 'none',
    'paddingInline': 'var(--lobe-menu-popup-padding)',
    'backgroundColor': cssVar.colorBgElevated,
    'boxShadow': `${cssVar.boxShadowSecondary}, var(--lobe-ring)`,
    'display': { default: null, [withVirtual]: 'flex' },
    'flexDirection': { default: null, [withVirtual]: 'column' },
    'paddingBlockEnd': { default: 'var(--lobe-menu-popup-padding)', [withFooter]: 0 },
    'paddingBlockStart': { default: 'var(--lobe-menu-popup-padding)', [withHeader]: 0 },
    'maxHeight': 'var(--available-height)',
    'minWidth': 220,
    'overflowX': { default: null, [withVirtual]: 'hidden' },
    'overflowY': { default: 'auto', [withVirtual]: 'hidden' },
  },

  popupWithSlots: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'var(--available-height)',
    overflowX: 'hidden',
    overflowY: 'hidden',
  },

  slotViewport: {
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
  },

  positioner: {
    '--lobe-dropdown-animation-duration': { default: '140ms', [instantPositioner]: '0ms' },
    '--lobe-dropdown-animation-ease-in': 'ease-in',
    '--lobe-dropdown-animation-ease-out': cssVar.motionEaseOut,
    '--lobe-dropdown-animation-scale-y': { default: '0.92', [instantPositioner]: '1' },
    'zIndex': { 'default': 1100, ':is([data-submenu], [data-nested])': 1199 },
  },

  separator: {
    marginBlock: 4,
    marginInline: 0,
    backgroundColor: cssVar.colorBorder,
    height: 1,
  },

  submenuArrow: {
    alignItems: 'center',
    color: `var(--lobe-menu-icon-color, ${cssVar.colorTextSecondary})`,
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    marginInlineStart: 8,
    height: 16,
    width: 16,
  },
});
