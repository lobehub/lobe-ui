import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const sliderFocus = ":is([role='slider']):focus-visible";
const sliderEnabled = ":is([role='slider']):not([aria-disabled='true'])";
const disabled = ":is([aria-disabled='true'])";
const rateSize = 'var(--lobe-rate-size, 20px)';

export const styles = stylex.create({
  empty: {
    color: cssVar.colorText,
    // Group opacity instead of the translucent colorFill so the star's stroke and fill don't double up where they overlap.
    opacity: 0.12,
  },
  fill: {
    insetBlock: 0,
    overflow: 'hidden',
    color: `var(--lobe-rate-color, ${cssVar.colorWarning})`,
    display: 'flex',
    insetInlineStart: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  half: {
    insetBlock: 0,
    insetInlineEnd: { 'default': null, ":is([data-half='end'])": 0 },
    insetInlineStart: { 'default': null, ":is([data-half='start'])": 0 },
    position: 'absolute',
    width: '50%',
  },
  halfFull: {
    width: '100%',
  },
  icon: {
    flex: 'none',
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
    minWidth: rateSize,
  },
  root: {
    borderRadius: { default: null, [sliderFocus]: 4 },
    gap: `calc(${rateSize} / 2)`,
    outline: { default: 'none', [sliderFocus]: `2px solid ${cssVar.colorText}` },
    alignItems: 'center',
    cursor: {
      default: null,
      [disabled]: 'not-allowed',
      [sliderEnabled]: 'pointer',
    },
    display: 'inline-flex',
    lineHeight: 1,
    opacity: { default: null, [disabled]: 0.5 },
    outlineOffset: { default: null, [sliderFocus]: 2 },
  },
  star: {
    flex: 'none',
    transition: 'transform 0.15s ease',
    alignItems: 'center',
    display: 'inline-flex',
    fontSize: rateSize,
    justifyContent: 'center',
    position: 'relative',
    transitionDuration: { default: null, [reducedMotion]: '0s' },
    height: rateSize,
  },
  starInteractive: {
    transform: { 'default': null, ':hover': 'scale(1.1)' },
  },
});
