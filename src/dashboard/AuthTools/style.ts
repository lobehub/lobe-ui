import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  localeIcon: {
    marginInlineEnd: 2,
  },
  themeIcon: {
    blockSize: 16,
    inlineSize: 16,
  },
  themeLabel: {
    padding: 0,
    borderWidth: 0,
    overflow: 'hidden',
    blockSize: 1,
    clipPath: 'inset(50%)',
    inlineSize: 1,
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
});
