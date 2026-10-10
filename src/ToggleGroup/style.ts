import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { toggleGroupItemMarker } from './marker.stylex';

export const styles = stylex.create({
  item: {
    font: 'inherit',
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 0,
    gap: 4,
    outline: 'none',
    transition: `background 120ms ${cssVar.motionEaseOut}, color 120ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: {
      'default': 'transparent',
      ':hover:not([data-disabled]):not([data-pressed])': cssVar.colorFillSecondary,
      ':is([data-pressed]):hover:not([data-disabled])': cssVar.colorFill,
      ':is([data-pressed]):is([data-disabled])': cssVar.colorFillSecondary,
      ':is([data-pressed]):not(:hover)': cssVar.colorFillSecondary,
    },
    color: {
      'default': cssVar.colorTextTertiary,
      ':hover:not([data-disabled])': cssVar.colorTextSecondary,
      ':is([data-disabled])': cssVar.colorTextDisabled,
      ':is([data-pressed]):not(:hover):not([data-disabled])': cssVar.colorText,
    },
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 12,
    justifyContent: 'center',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  itemIcon: {
    alignItems: 'center',
    display: 'inline-flex',
    flexShrink: 0,
  },
  itemLabel: {
    alignItems: 'center',
    display: 'inline-flex',
  },
  itemMiddle: {
    paddingInline: 8,
    height: 28,
  },
  itemOutlined: {
    borderRadius: 0,
    borderInlineStartColor: {
      default: null,
      [stylex.when.siblingBefore(':is(*)', toggleGroupItemMarker)]: cssVar.colorBorderSecondary,
    },
    borderInlineStartStyle: {
      default: null,
      [stylex.when.siblingBefore(':is(*)', toggleGroupItemMarker)]: 'solid',
    },
    borderInlineStartWidth: {
      default: null,
      [stylex.when.siblingBefore(':is(*)', toggleGroupItemMarker)]: 1,
    },
  },
  itemSmall: {
    paddingInline: 6,
    height: 24,
  },
  root: {
    alignItems: 'center',
    display: 'inline-flex',
  },
  rootBorderless: {
    gap: 2,
  },
  rootOutlined: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
  },
});
