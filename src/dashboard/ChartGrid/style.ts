import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  /**
   * The frame is the container. A query on the grid itself would not see its own width.
   * Charts stay two-up so a trend and its switch stay readable; one child does not
   * stretch across the page.
   */
  frame: {
    containerType: 'inline-size',
  },
  root: {
    gap: 16,
    alignItems: 'stretch',
    display: 'grid',
    gridTemplateColumns: {
      'default': 'repeat(2, minmax(0, 1fr))',
      ':has(> :only-child)': 'minmax(0, min(100%, 560px))',
      '@container (max-width: 640px)': {
        'default': 'minmax(0, 1fr)',
        ':has(> :only-child)': 'minmax(0, min(100%, 560px))',
      },
    },
  },
});
