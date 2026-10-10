import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const active = ':is([data-hovering], [data-scrolling])';
const vertical = ':is([data-orientation="vertical"])';
const horizontal = ':is([data-orientation="horizontal"])';
const verticalHover = ':is([data-orientation="vertical"]):hover';
const verticalIdle = ':is([data-orientation="vertical"]):not(:hover)';
const horizontalHover = ':is([data-orientation="horizontal"]):hover';
const horizontalIdle = ':is([data-orientation="horizontal"]):not(:hover)';

export const styles = stylex.create({
  corner: {
    backgroundColor: cssVar.colorFillSecondary,
  },
  root: {
    boxSizing: 'border-box',
    position: 'relative',
  },
  scrollbar: {
    'margin': 3,
    'borderRadius': cssVar.borderRadiusSM,
    'transition': 'opacity 150ms, width 150ms, height 150ms',
    'backgroundColor': 'transparent',
    'opacity': { [active]: 1, default: 0 },
    'pointerEvents': { [active]: 'auto', default: 'none' },
    'transitionDuration': { 'default': null, ':is([data-scrolling])': '0ms, 150ms, 150ms' },
    'height': {
      default: null,
      [horizontalHover]: 6,
      [horizontalIdle]: 3,
    },
    'width': {
      default: null,
      [verticalHover]: 6,
      [verticalIdle]: 3,
    },
    '::before': {
      content: "''",
      insetBlockStart: { default: null, [horizontal]: '50%' },
      insetInlineStart: { default: null, [vertical]: '50%' },
      position: 'absolute',
      transform: {
        default: null,
        [horizontal]: 'translateY(-50%)',
        [vertical]: 'translateX(-50%)',
      },
      height: { default: null, [horizontal]: 16, [vertical]: '100%' },
      width: { default: null, [horizontal]: '100%', [vertical]: 16 },
    },
  },
  thumb: {
    borderRadius: 'inherit',
    backgroundColor: cssVar.colorTextQuaternary,
    height: '100%',
    width: '100%',
  },
  viewport: {
    outline: 'none',
    overscrollBehavior: 'auto',
    position: 'relative',
    height: '100%',
  },
});
