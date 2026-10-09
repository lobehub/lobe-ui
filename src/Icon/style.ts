import * as stylex from '@stylexjs/stylex';

const spin = stylex.keyframes({
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const styles = stylex.create({
  root: {
    alignItems: 'center',
    display: 'inline-flex',
    lineHeight: 0,
    verticalAlign: '-0.125em',
  },
  spin: {
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationName: spin,
    animationTimingFunction: 'linear',
  },
});
