import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const glide = 'cubic-bezier(0.23, 1, 0.32, 1)';

export const styles = stylex.create({
  // Only moves once it is already on screen: the first row it lands on gets a
  // plain fade instead of a slide in from wherever it rested last.
  gliding: {
    transitionDuration: { default: '220ms, 220ms, 220ms, 220ms, 150ms', [reducedMotion]: '0s' },
    transitionProperty: 'top, left, width, height, opacity',
    transitionTimingFunction: `${glide}, ${glide}, ${glide}, ${glide}, ease`,
  },
  // z-index -1 inside the isolated root paints the layer above the root's own
  // background and below every row, so the rows need no stacking of their own.
  highlight: {
    borderRadius: `var(--lobe-glide-highlight-radius, ${cssVar.borderRadius})`,
    backgroundColor: `var(--lobe-glide-highlight-color, ${cssVar.colorFillTertiary})`,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transitionDuration: { default: '150ms', [reducedMotion]: '0s' },
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease',
    zIndex: -1,
  },
  root: {
    isolation: 'isolate',
    position: 'relative',
  },
  visible: {
    opacity: 1,
  },
});
