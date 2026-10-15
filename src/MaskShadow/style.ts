import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  bottom: {
    maskImage:
      'linear-gradient(180deg, #000 calc(100% - var(--mask-shadow-size, 40%)), transparent)',
  },
  left: {
    maskImage:
      'linear-gradient(270deg, #000 calc(100% - var(--mask-shadow-size, 40%)), transparent)',
  },
  right: {
    maskImage:
      'linear-gradient(90deg, #000 calc(100% - var(--mask-shadow-size, 40%)), transparent)',
  },
  root: {
    'overflow': 'hidden',
    'position': 'relative',
    'scrollbarWidth': 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
  top: {
    maskImage: 'linear-gradient(0deg, #000 calc(100% - var(--mask-shadow-size, 40%)), transparent)',
  },
});
