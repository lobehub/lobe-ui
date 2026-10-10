import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { sliderMarker } from './marker.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const activeRing = `0 0 0 2px ${cssVar.colorPrimaryBorder}`;

export const styles = stylex.create({
  control: {
    alignItems: 'center',
    display: 'flex',
    height: 20,
    width: '100%',
  },
  indicator: {
    borderRadius: 'inherit',
    backgroundColor: {
      default: cssVar.colorPrimary,
      [stylex.when.ancestor('[data-disabled]', sliderMarker)]: cssVar.colorTextQuaternary,
    },
  },
  root: {
    alignItems: 'center',
    cursor: { 'default': null, ':is([data-disabled])': 'not-allowed' },
    display: 'flex',
    width: '100%',
  },
  thumb: {
    'borderRadius': 100,
    'transition': `box-shadow 150ms ${cssVar.motionEaseOut}`,
    'backgroundColor': {
      default: cssVar.colorPrimary,
      [stylex.when.ancestor('[data-disabled]', sliderMarker)]: cssVar.colorTextQuaternary,
    },
    'boxShadow': {
      'default': `0 0 0 1px ${cssVar.colorBgContainer}`,
      ':hover:not([data-disabled] *)': activeRing,
      [stylex.when.ancestor('[data-dragging]', sliderMarker)]: activeRing,
    },
    'flexShrink': 0,
    'transitionDuration': { default: null, [reducedMotion]: '0s' },
    'height': 16,
    'width': 8,
    '::before': {
      content: "''",
      insetBlockStart: '50%',
      insetInlineStart: '50%',
      position: 'absolute',
      translate: '-50% -50%',
      height: 40,
      width: 24,
    },
  },
  track: {
    borderRadius: 100,
    backgroundColor: cssVar.colorFillSecondary,
    height: 4,
    width: '100%',
  },
});

export const sliderStyles = Object.fromEntries(
  Object.entries(styles).map(([key, value]) => [key, stylex.props(value).className ?? '']),
) as Record<keyof typeof styles, string>;
