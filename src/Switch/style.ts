import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { switchMarker } from './marker.stylex';

const loadingSpin = stylex.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const enabledHover = ':hover:not([data-disabled])';

export const styles = stylex.create({
  icon: {
    insetBlock: 0,
    transition: `opacity 200ms ${cssVar.motionEaseOut}, scale 200ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    color: cssVar.colorBgLayout,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
    transitionDuration: { default: null, [reducedMotion]: '0s' },
  },
  iconLeft: {
    insetInlineStart: 4,
    opacity: { default: 0, [stylex.when.ancestor('[data-checked]', switchMarker)]: 1 },
    scale: { default: 0, [stylex.when.ancestor('[data-checked]', switchMarker)]: 1 },
  },
  iconRight: {
    insetInlineEnd: 4,
    opacity: { default: null, [stylex.when.ancestor('[data-checked]', switchMarker)]: 0 },
    scale: { default: null, [stylex.when.ancestor('[data-checked]', switchMarker)]: 0 },
  },
  iconThumb: {
    inset: 'unset',
    insetBlock: 'unset',
    color: cssVar.colorPrimary,
    position: 'relative',
    transform: 'none',
  },
  loading: {
    animationDuration: { default: '1s', [reducedMotion]: '0s' },
    animationIterationCount: 'infinite',
    animationName: loadingSpin,
    animationTimingFunction: 'linear',
  },
  root: {
    padding: 2,
    borderColor: 'currentcolor',
    borderRadius: 100,
    borderStyle: 'none',
    borderWidth: 0,
    outline: 'none',
    overflow: 'hidden',
    transition: `background 200ms ${cssVar.motionEaseOut}, box-shadow 200ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: {
      'default': cssVar.colorFillSecondary,
      [enabledHover]: cssVar.colorFill,
      ':is([data-checked])': cssVar.colorPrimary,
      ':is([data-checked]):hover:not([data-disabled])': cssVar.colorPrimaryHover,
    },
    boxShadow: {
      'default': 'inset 0 1.5px 2px rgb(0 0 0 / 8%)',
      ':is([data-checked])': 'inset 0 1.5px 3px rgb(0 0 0 / 18%)',
    },
    boxSizing: 'border-box',
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    justifyContent: 'flex-start',
    opacity: { 'default': null, ':is([data-disabled])': 0.45 },
    position: 'relative',
    transitionDuration: { default: null, [reducedMotion]: '0s' },
    userSelect: 'none',
  },
  rootDefault: {
    height: 22,
    minWidth: 36,
    width: 36,
  },
  rootSmall: {
    height: 16,
    minWidth: 28,
    width: 28,
  },
  thumb: {
    borderRadius: '50%',
    transition: `box-shadow 200ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: {
      'default':
        '0 0 0 0.5px rgb(0 0 0 / 4%), 0 1px 1px rgb(0 0 0 / 6%), 0 3px 8px rgb(0 30 80 / 16%)',
      ':is([data-disabled])': 'none',
      [stylex.when.ancestor(enabledHover, switchMarker)]:
        '0 0 0 0.5px rgb(0 0 0 / 4%), 0 1px 1px rgb(0 0 0 / 8%), 0 6px 14px rgb(0 30 80 / 24%)',
    },
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    transform: 'translateX(calc(var(--switch-x, 0px) * var(--switch-dir, 1)))',
    transitionDuration: { default: null, [reducedMotion]: '0s' },
  },
  thumbDefault: {
    height: 18,
    width: 18,
  },
  thumbSmall: {
    height: 12,
    width: 12,
  },
});
