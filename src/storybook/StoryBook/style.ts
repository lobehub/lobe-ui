import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  editor: {
    minHeight: '100%',
    /* A demo can be wider than the frame (tables with `scroll.x`, wide code).
       Without this the item's min-content inflates the parent grid track and
       the demo overflows the frame instead of scrolling inside it. */
    minWidth: 0,
    width: '100%',
  },
  left: {
    overflow: 'auto',
    position: 'relative',
    minWidth: 0,
  },
});
