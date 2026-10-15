import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  canvas: {
    inset: 0,
    blockSize: '100%',
    display: 'block',
    inlineSize: '100%',
    position: 'absolute',
  },
  root: {
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 0,
  },
});
