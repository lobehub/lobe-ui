import * as stylex from '@stylexjs/stylex';

export const gridTemplateColumns =
  'repeat(auto-fill, minmax(max(min(var(--max-item-width), 100%), calc((100% - var(--gap) * (var(--rows) - 1)) / var(--rows))), 1fr))';

export const styles = stylex.create({
  root: {
    '--gap': 'var(--grid-gap, 1em)',
    '--max-item-width': 'var(--grid-max-item-width, 240px)',
    '--rows': 'var(--grid-rows, 3)',
    'display': 'grid',
    // eslint-disable-next-line @stylexjs/valid-styles -- the rule cannot resolve a module constant; the compiler inlines it
    'gridTemplateColumns': gridTemplateColumns,
  },
});
