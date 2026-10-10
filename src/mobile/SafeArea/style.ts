import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  bottom: {
    paddingBlockEnd: 'env(safe-area-inset-bottom)',
  },
  container: {
    flex: 'none',
    overflow: 'hidden',
    width: '100vw',
  },
  top: {
    paddingBlockStart: 'env(safe-area-inset-top)',
  },
});
