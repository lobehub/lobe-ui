import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  container: {
    position: 'relative',
  },
  icon: {
    flex: 'none',
    lineHeight: 1,
    position: 'relative',
  },
  inner: {
    position: 'absolute',
    zIndex: 1,
  },
});
