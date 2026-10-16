import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  root: {
    padding: 0,
    borderRadius: 'var(--docs-radius-sm)',
    borderWidth: 0,
    placeItems: 'center',
    transition: 'color 140ms ease, background-color 140ms ease',
    backgroundColor: {
      'default': 'transparent',
      ':hover': 'var(--docs-surface-hover)',
    },
    color: {
      'default': 'var(--docs-text-subtle)',
      ':is([data-copied])': 'var(--docs-accent)',
      ':hover': 'var(--docs-text-primary)',
    },
    cursor: 'pointer',
    display: 'inline-grid',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
    height: '1.75rem',
    width: '1.75rem',
  },
});
