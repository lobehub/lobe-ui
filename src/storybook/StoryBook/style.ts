import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  editor: {
    minHeight: '100%',
    width: '100%',
  },
  left: {
    overflow: 'auto',
    position: 'relative',
  },
  leftWithPadding: {
    overflow: 'auto',
    paddingBlock: 40,
    paddingInline: 24,
    position: 'relative',
  },
});
