import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

const sweep = stylex.keyframes({
  '0%': { translate: '-100% 0' },
  '100%': { translate: '100% 0' },
});

const fade = stylex.keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

export const styles = stylex.create({
  avatar: {
    flex: 'none',
  },
  base: {
    borderRadius: cssVar.borderRadius,
    overflow: 'hidden',
    backgroundColor: cssVar.colorFillContent,
    position: 'relative',
    userSelect: 'none',
  },
  fade: {
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: { default: fade, [reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    willChange: 'opacity',
  },
  sweep: {
    '::after': {
      inset: 0,
      animationDuration: '1.4s',
      animationIterationCount: 'infinite',
      animationName: sweep,
      animationTimingFunction: 'ease',
      backgroundImage: `linear-gradient(90deg, transparent 0%, ${cssVar.colorFill} 50%, transparent 100%)`,
      content: "''",
      display: { default: null, [reducedMotion]: 'none' },
      pointerEvents: 'none',
      position: 'absolute',
      willChange: 'transform',
    },
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
});
