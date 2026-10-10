import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  bottom: {
    maskImage:
      'linear-gradient(180deg, #000 calc(100% - var(--scroll-shadow-size, 40%)), transparent)',
  },
  hideScrollBar: {
    'scrollbarWidth': 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
  horizontal: {
    overflowX: 'auto',
  },
  left: {
    maskImage:
      'linear-gradient(270deg, #000 calc(100% - var(--scroll-shadow-size, 40%)), transparent)',
  },
  leftRight: {
    maskImage:
      'linear-gradient(to right, #000, #000, transparent 0, #000 var(--scroll-shadow-size, 40%), #000 calc(100% - var(--scroll-shadow-size, 40%)), transparent)',
  },
  right: {
    maskImage:
      'linear-gradient(90deg, #000 calc(100% - var(--scroll-shadow-size, 40%)), transparent)',
  },
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  top: {
    maskImage:
      'linear-gradient(0deg, #000 calc(100% - var(--scroll-shadow-size, 40%)), transparent)',
  },
  topBottom: {
    maskImage:
      'linear-gradient(#000, #000, transparent 0, #000 var(--scroll-shadow-size, 40%), #000 calc(100% - var(--scroll-shadow-size, 40%)), transparent)',
  },
  vertical: {
    overflowY: 'auto',
  },
});
