import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { focusRing } from '@/styles/stylex/focusRing';

import type { TabsSize, TabsVariant } from './type';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const vertical = ':is([data-orientation="vertical"])';
const indicatorStart = 'var(--lobe-tabs-indicator-start, var(--active-tab-left))';

export const styles = stylex.create({
  indicator: {
    pointerEvents: 'none',
    position: 'absolute',
    transitionDuration: { default: '240ms', [reducedMotion]: '0s' },
    transitionProperty: 'inset-inline-start, inset-block-start, width, height, transform',
    transitionTimingFunction: cssVar.motionEaseOut,
    zIndex: 0,
  },
  indicatorPoint: {
    borderRadius: '50%',
    backgroundColor: cssVar.colorPrimary,
    insetBlockEnd: 6,
    insetInlineStart: `calc(${indicatorStart} + var(--active-tab-width) / 2 - 2.5px)`,
    height: 5,
    width: 5,
  },
  indicatorRounded: {
    borderRadius: cssVar.borderRadius,
    backgroundColor: cssVar.colorBgElevated,
    boxShadow: cssVar.boxShadowTertiary,
    insetBlockStart: 'var(--active-tab-top)',
    insetInlineStart: indicatorStart,
    height: 'var(--active-tab-height)',
    width: 'var(--active-tab-width)',
  },
  indicatorSquare: {
    backgroundColor: cssVar.colorPrimary,
    insetBlockEnd: 0,
    insetInlineStart: indicatorStart,
    height: 2,
    width: 'var(--active-tab-width)',
  },
  list: {
    gap: 2,
    alignItems: { default: 'center', [vertical]: 'stretch' },
    display: 'inline-flex',
    flexDirection: { default: null, [vertical]: 'column' },
    flexWrap: 'nowrap',
    position: 'relative',
  },
  listRounded: {
    padding: 3,
    borderRadius: cssVar.borderRadiusLG,
    gap: 4,
    alignSelf: { default: 'flex-start', [vertical]: 'stretch' },
    backgroundColor: cssVar.colorBgLayout,
  },
  listSquare: {
    gap: 16,
    boxShadow: {
      default: `inset 0 -1px 0 ${cssVar.colorBorderSecondary}`,
      [vertical]: `inset -1px 0 0 ${cssVar.colorBorderSecondary}`,
    },
  },
  panel: {
    borderRadius: cssVar.borderRadius,
    outline: 'none',
    paddingBlockStart: 12,
  },
  root: {
    display: 'flex',
    flexDirection: { default: 'column', [vertical]: 'row' },
    width: '100%',
  },
  tab: {
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 0,
    gap: 6,
    outline: 'none',
    transition: `color 120ms ${cssVar.motionEaseOut}, transform 120ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    color: {
      'default': cssVar.colorTextSecondary,
      ':hover:not([data-disabled])': cssVar.colorText,
      ':is([data-active]):not(:hover):not([data-disabled])': cssVar.colorPrimary,
      ':is([data-disabled])': cssVar.colorTextDisabled,
    },
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    fontWeight: 500,
    justifyContent: 'center',
    position: 'relative',
    transform: { 'default': null, ':active:not([data-disabled])': 'scale(0.98)' },
    transitionDuration: { default: null, [reducedMotion]: '0s' },
    userSelect: 'none',
    whiteSpace: 'nowrap',
    zIndex: 1,
  },
  tabLarge: {
    borderRadius: cssVar.borderRadius,
    paddingInline: 16,
    fontSize: 14,
    height: 36,
  },
  tabMiddle: {
    borderRadius: cssVar.borderRadius,
    paddingInline: 12,
    fontSize: 13,
    height: 32,
  },
  tabPoint: {
    paddingBlockEnd: 14,
    paddingBlockStart: 8,
    height: 'auto',
  },
  tabSmall: {
    borderRadius: cssVar.borderRadius,
    paddingInline: 10,
    fontSize: 12,
    height: 26,
  },
  tabSquare: {
    borderRadius: 0,
    paddingBlock: 8,
    height: 'auto',
  },
});

const indicatorVariantStyles = {
  point: styles.indicatorPoint,
  rounded: styles.indicatorRounded,
  square: styles.indicatorSquare,
};

const tabSizeStyles = {
  large: styles.tabLarge,
  middle: styles.tabMiddle,
  small: styles.tabSmall,
};

const tabVariantStyles = {
  point: styles.tabPoint,
  rounded: null,
  square: styles.tabSquare,
};

const listVariantStyles = {
  point: null,
  rounded: styles.listRounded,
  square: styles.listSquare,
};

export const tabStyles = (size: TabsSize, variant: TabsVariant) => [
  styles.tab,
  focusRing.info,
  tabSizeStyles[size],
  tabVariantStyles[variant],
];

export const indicatorStyles = (variant: TabsVariant) => [
  styles.indicator,
  indicatorVariantStyles[variant],
];

export const listStyles = (variant: TabsVariant) => [styles.list, listVariantStyles[variant]];

export const panelStyles = [styles.panel, focusRing.info];

export const tabsStyles = {
  ...(Object.fromEntries(
    Object.entries(styles).map(([key, value]) => [key, stylex.props(value).className ?? '']),
  ) as Record<keyof typeof styles, string>),
  panel: stylex.props(panelStyles).className ?? '',
  tab: stylex.props(styles.tab, focusRing.info).className ?? '',
};
