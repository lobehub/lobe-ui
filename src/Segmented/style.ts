import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { segmentedMarker } from './marker.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const vertical = ':is([data-orientation="vertical"])';

export const styles = stylex.create({
  indicator: {
    borderRadius: cssVar.borderRadius,
    backgroundColor: {
      default: cssVar.colorBgElevated,
      [stylex.when.ancestor('[data-variant="outlined"]', segmentedMarker)]:
        cssVar.colorFillSecondary,
    },
    boxShadow: 'none',
    insetBlockStart: 'var(--active-item-top)',
    insetInlineStart: 'var(--lobe-segmented-indicator-start, var(--active-item-left))',
    pointerEvents: 'none',
    position: 'absolute',
    transitionDuration: { default: '240ms', [reducedMotion]: '0s' },
    transitionProperty: 'inset-inline-start, inset-block-start, width, height',
    transitionTimingFunction: cssVar.motionEaseOut,
    zIndex: 0,
    height: 'var(--active-item-height)',
    width: 'var(--active-item-width)',
  },
  item: {
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
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
      ':hover:not([data-disabled]):not([data-pressed])': cssVar.colorText,
      ':is([data-disabled])': cssVar.colorTextDisabled,
      ':is([data-pressed]):not([data-disabled])': cssVar.colorText,
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
  itemBlock: {
    flexBasis: '0',
    flexGrow: '1',
    flexShrink: '1',
  },
  itemIcon: {
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
  },
  itemLabel: {
    alignItems: 'center',
    display: 'inline-flex',
  },
  itemLarge: {
    borderRadius: cssVar.borderRadius,
    paddingInline: 16,
    fontSize: 14,
    height: 36,
  },
  itemMiddle: {
    borderRadius: cssVar.borderRadius,
    paddingInline: 12,
    fontSize: 13,
    height: 32,
  },
  itemSmall: {
    borderRadius: cssVar.borderRadius,
    paddingInline: 10,
    fontSize: 12,
    height: 26,
  },
  list: {
    padding: 3,
    borderRadius: cssVar.borderRadiusLG,
    gap: 4,
    alignItems: { default: 'center', [vertical]: 'stretch' },
    alignSelf: { default: 'flex-start', [vertical]: 'stretch' },
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexDirection: { default: null, [vertical]: 'column' },
    flexWrap: 'nowrap',
    position: 'relative',
  },
  listBlock: {
    alignSelf: 'stretch',
    display: 'flex',
    width: '100%',
  },
  listFilled: {
    borderColor: cssVar.colorFillQuaternary,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgLayout,
  },
  listGlass: {
    backdropFilter: 'saturate(150%) blur(10px)',
  },
  listOutlined: {
    borderColor: cssVar.colorBorderSecondary,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  listShadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});
