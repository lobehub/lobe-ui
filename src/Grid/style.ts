import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  root: {
    '--gap': 'var(--grid-gap, 1em)',
    '--max-item-width': 'var(--grid-max-item-width, 240px)',
    '--rows': 'var(--grid-rows, 3)',
    'display': 'grid',
    'gridTemplateColumns':
      'repeat(auto-fill, minmax(max(var(--max-item-width), calc((100% - var(--gap) * (var(--rows) - 1)) / var(--rows))), 1fr))',
  },
});
