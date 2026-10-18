import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  inputSmall: {
    fontSize: 14,
  },
  root: {
    width: '100%',
  },
  sizeLarge: {
    height: 40,
  },
  sizeMiddle: {
    height: 32,
  },
  sizeSmall: {
    height: 24,
  },
});

export const sizeStyles = {
  large: styles.sizeLarge,
  middle: styles.sizeMiddle,
  small: styles.sizeSmall,
};
