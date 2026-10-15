import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { focusRing } from '@/styles/stylex/focusRing';

import { selectMarker } from './marker.stylex';

const open =
  ":not([data-disabled], [data-readonly]):is([data-popup-open], [data-open], [data-state='open'], [aria-expanded='true'])";
const hover =
  ":hover:not([data-disabled], [data-readonly], [data-popup-open], [data-open], [data-state='open'], [aria-expanded='true'])";
const disabled = ':is([data-disabled]):not([data-readonly])';
const readonly = ':is([data-readonly])';
const startingOrEnding = ':is([data-starting-style], [data-ending-style])';
const openBg = `var(--lobe-select-open-bg, ${cssVar.colorFillTertiary})`;
const disabledBg = 'var(--lobe-select-disabled-bg, transparent)';
const readonlyBg = 'var(--lobe-select-readonly-bg, transparent)';

export const styles = stylex.create({
  arrow: {
    display: 'flex',
    height: 6,
    width: 12,
  },
  borderless: {
    '--lobe-select-disabled-bg': `color-mix(in srgb, ${cssVar.colorFillTertiary} 55%, transparent)`,
    '--lobe-select-open-bg': cssVar.colorFillTertiary,
    '--lobe-select-readonly-bg': `color-mix(in srgb, ${cssVar.colorFillTertiary} 70%, transparent)`,
    'borderColor': 'currentcolor',
    'borderStyle': 'none',
    'borderWidth': 'medium',
    'backgroundColor': {
      default: 'transparent',
      [disabled]: disabledBg,
      [hover]: cssVar.colorFillTertiary,
      [open]: openBg,
      [readonly]: readonlyBg,
    },
    'boxShadow': 'none',
  },
  clear: {
    transition: `opacity 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    color: { 'default': cssVar.colorTextTertiary, ':hover': cssVar.colorTextSecondary },
    display: 'inline-flex',
    opacity: {
      default: 0,
      [stylex.when.ancestor(':hover:not([data-placeholder], [data-disabled])', selectMarker)]: 1,
    },
    pointerEvents: {
      default: null,
      [stylex.when.ancestor(':is([data-placeholder], [data-disabled])', selectMarker)]: 'none',
    },
  },
  empty: {
    color: cssVar.colorTextTertiary,
  },
  filled: {
    '--lobe-select-disabled-bg': `color-mix(in srgb, ${cssVar.colorFillTertiary} 55%, transparent)`,
    '--lobe-select-open-bg': cssVar.colorFillSecondary,
    '--lobe-select-readonly-bg': `color-mix(in srgb, ${cssVar.colorFillTertiary} 70%, transparent)`,
    'backgroundColor': {
      default: cssVar.colorFillTertiary,
      [disabled]: disabledBg,
      [hover]: cssVar.colorFillSecondary,
      [open]: openBg,
      [readonly]: readonlyBg,
    },
  },
  icon: {
    transition: `transform 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    display: 'inline-flex',
    transform: { 'default': null, ':is([data-popup-open])': 'rotate(180deg)' },
  },
  itemBoldSelected: {
    fontWeight: { 'default': null, ':is([data-selected])': 600 },
  },
  itemIndicator: {
    alignItems: 'center',
    color: cssVar.colorPrimary,
    display: 'inline-flex',
    justifyContent: 'center',
    marginInlineStart: 'auto',
    paddingInlineStart: 8,
  },
  list: {
    flex: '1',
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    minHeight: 0,
    overflowY: 'auto',
  },
  listWithSearch: {
    paddingBlockStart: 4,
  },
  outlined: {
    '--lobe-select-disabled-bg': `color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent)`,
    '--lobe-select-open-bg': cssVar.colorFillTertiary,
    '--lobe-select-readonly-bg': `color-mix(in srgb, ${cssVar.colorBgContainer} 75%, transparent)`,
    'borderColor': { 'default': cssVar.colorBorderSecondary, ':hover': cssVar.colorBorder },
    'borderStyle': 'solid',
    'borderWidth': 1,
    'backgroundColor': {
      default: cssVar.colorBgContainer,
      [disabled]: disabledBg,
      [open]: openBg,
      [readonly]: readonlyBg,
    },
  },
  popup: {
    '--lobe-select-available-height':
      'min(var(--available-height), var(--lobe-select-popup-max-height, var(--available-height)))',
    'transition': `opacity 150ms ${cssVar.motionEaseOut}, transform 150ms ${cssVar.motionEaseOut}`,
    'boxSizing': 'border-box',
    'display': 'flex',
    'flexDirection': 'column',
    'opacity': { default: null, [startingOrEnding]: 0 },
    'transform': { default: null, [startingOrEnding]: 'scaleY(0.92)' },
    'transformOrigin': 'var(--transform-origin)',
    'maxHeight': 'var(--lobe-select-available-height)',
  },
  positioner: {
    outline: 'none',
    zIndex: 1100,
  },
  prefix: {
    alignItems: 'center',
    color: cssVar.colorTextSecondary,
    display: 'inline-flex',
  },
  scrollArrow: {
    alignItems: 'center',
    backgroundColor: cssVar.colorBgElevated,
    color: cssVar.colorTextSecondary,
    cursor: 'default',
    display: 'flex',
    justifyContent: 'center',
    height: 16,
  },
  search: {
    marginInline: 'calc(-1 * var(--lobe-menu-popup-padding))',
    paddingBlock: 8,
    paddingInline: 12,
    alignItems: 'center',
    borderBlockEndColor: cssVar.colorFillSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    cursor: 'text',
    display: 'flex',
    minHeight: 36,
  },
  searchInput: {
    'borderColor': 'currentcolor',
    'borderStyle': 'none',
    'borderWidth': 0,
    'flex': '1',
    'outline': 'none',
    'paddingBlock': 0,
    'paddingInline': 4,
    'backgroundColor': 'transparent',
    'color': cssVar.colorText,
    'fontSize': 14,
    'lineHeight': '20px',
    'minWidth': 0,
    '::placeholder': { color: cssVar.colorTextPlaceholder },
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
  suffix: {
    gap: 6,
    alignItems: 'center',
    color: cssVar.colorTextSecondary,
    display: 'inline-flex',
  },
  tag: {
    borderRadius: cssVar.borderRadiusSM,
    paddingBlock: 0,
    paddingInline: 6,
    alignItems: 'center',
    backgroundColor: cssVar.colorFillTertiary,
    color: cssVar.colorText,
    display: 'inline-flex',
    fontSize: 12,
    lineHeight: '20px',
    maxWidth: '100%',
  },
  tagClose: {
    transition: `opacity 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    color: cssVar.colorTextSecondary,
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    marginInlineStart: 4,
  },
  tags: {
    gap: 4,
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  tagsSearch: {
    flex: '1',
    display: 'flex',
    minWidth: 48,
  },
  tagsValue: {
    flexBasis: 'auto',
    flexGrow: '0',
    flexShrink: '1',
  },
  trigger: {
    borderColor: 'transparent',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 8,
    outline: 'none',
    transition: `all 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    boxSizing: 'border-box',
    color: {
      default: cssVar.colorText,
      [disabled]: cssVar.colorTextDisabled,
      [readonly]: cssVar.colorTextSecondary,
    },
    cursor: { default: 'pointer', [disabled]: 'not-allowed', [readonly]: 'default' },
    display: 'inline-flex',
    fontFamily: 'inherit',
    userSelect: 'none',
    width: '100%',
  },
  triggerLarge: {
    paddingBlock: 6,
    paddingInline: 12,
    fontSize: 16,
    lineHeight: '24px',
    minHeight: 40,
  },
  triggerMiddle: {
    paddingBlock: 4,
    paddingInline: 11,
    fontSize: 14,
    lineHeight: '20px',
    minHeight: 32,
  },
  triggerSmall: {
    paddingBlock: 0,
    paddingInline: 8,
    fontSize: 12,
    lineHeight: '18px',
    minHeight: 24,
  },
  value: {
    flex: '1',
    gap: 4,
    alignItems: 'center',
    color: { 'default': 'inherit', ':is([data-placeholder])': cssVar.colorTextPlaceholder },
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  valueText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const triggerSizeStyles = {
  large: styles.triggerLarge,
  middle: styles.triggerMiddle,
  small: styles.triggerSmall,
};

export const triggerStyles = ({
  shadow,
  size,
  variant,
}: {
  shadow?: boolean;
  size?: keyof typeof triggerSizeStyles;
  variant: 'borderless' | 'filled' | 'outlined';
}) => [
  styles.trigger,
  focusRing.info,
  selectMarker,
  shadow && styles.shadow,
  triggerSizeStyles[size ?? 'middle'],
  styles[variant],
];
