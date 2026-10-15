import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const ringIn = stylex.keyframes({
  from: { outlineColor: 'transparent', outlineOffset: 5 },
});

const focusVisible = ':focus-visible:not([data-lobe-focus-ring="managed"])';
const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const forcedColors = '@media (forced-colors: active)';

export const focusRing = stylex.create({
  info: {
    '--lobe-focus-ring-color': cssVar.colorInfo,
    'animationDuration': {
      default: null,
      [focusVisible]: '200ms',
      [forcedColors]: { default: null, [focusVisible]: '0s' },
      [reducedMotion]: { default: null, [focusVisible]: '0s' },
    },
    'animationName': {
      default: null,
      [focusVisible]: ringIn,
      [forcedColors]: { default: null, [focusVisible]: 'none' },
      [reducedMotion]: { default: null, [focusVisible]: 'none' },
    },
    'animationTimingFunction': {
      default: null,
      [focusVisible]: 'cubic-bezier(0.22, 1, 0.36, 1)',
      [forcedColors]: { default: null, [focusVisible]: 'ease' },
      [reducedMotion]: { default: null, [focusVisible]: 'ease' },
    },
    'outlineColor': {
      default: null,
      [focusVisible]: `color-mix(in srgb, ${cssVar.colorInfo} 90%, transparent)`,
      [forcedColors]: { default: null, [focusVisible]: 'CanvasText' },
    },
    'outlineOffset': { default: null, [focusVisible]: 2 },
    'outlineStyle': { default: null, [focusVisible]: 'solid' },
    'outlineWidth': { default: null, [focusVisible]: 2 },
  },
});
