import * as stylex from '@stylexjs/stylex';

const spin = stylex.keyframes({
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const styles = stylex.create({
  spin: {
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationName: spin,
    animationTimingFunction: 'linear',
  },
});
