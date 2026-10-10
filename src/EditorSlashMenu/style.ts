import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  hiddenInput: {
    margin: -1,
    padding: 0,
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 0,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    position: 'absolute',
    whiteSpace: 'nowrap',
    height: 1,
    width: 1,
  },
  list: {
    overflow: 'auto',
    maxHeight: 320,
  },
});
