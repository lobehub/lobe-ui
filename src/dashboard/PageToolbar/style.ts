import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  actions: {
    flex: 'none',
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    marginInlineStart: 'auto',
  },
  filters: {
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    flexBasis: 'auto',
    flexGrow: '0',
    flexShrink: '1',
    flexWrap: 'wrap',
    minInlineSize: 0,
  },
  root: {
    alignItems: 'center',
    columnGap: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    minInlineSize: 0,
    rowGap: '8px',
  },
});
