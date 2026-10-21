import * as stylex from '@stylexjs/stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const compactSearch = '@media (width <= 64rem)';

export const styles = stylex.create({
  actionLink: {
    paddingInline: '0.5rem',
    textDecoration: 'none',
    transition: 'color 140ms ease',
    alignItems: 'center',
    color: {
      'default': 'var(--docs-text-subtle)',
      ':hover': 'var(--docs-text-primary)',
    },
    display: {
      'default': 'inline-flex',
      '@media (width <= 47.5rem)': 'none',
    },
    fontSize: '0.8438rem',
    fontWeight: 480,
    whiteSpace: 'nowrap',
  },
  iconButton: {
    padding: 0,
    borderRadius: 'var(--docs-radius-md)',
    borderWidth: 0,
    placeItems: 'center',
    transition: 'color 140ms ease, background-color 140ms ease, transform 90ms ease',
    backgroundColor: {
      'default': 'transparent',
      ':hover': 'var(--docs-surface-hover)',
    },
    color: {
      'default': 'var(--docs-text-subtle)',
      ':hover': 'var(--docs-text-primary)',
    },
    cursor: 'pointer',
    display: 'inline-grid',
    transform: {
      'default': null,
      ':active': 'scale(0.96)',
    },
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
    height: '2rem',
    minWidth: '2rem',
    width: '2rem',
  },
  scrollArea: {
    flexBasis: '0%',
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
  },
  scrollContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  scrollViewport: {
    scrollPaddingBlockStart: '1.5rem',
  },
  search: {
    font: 'inherit',
    borderColor: {
      'default': 'var(--docs-border-default)',
      ':hover': 'var(--docs-border-strong)',
    },
    borderRadius: 'var(--docs-radius-md)',
    borderStyle: 'solid',
    borderWidth: {
      [compactSearch]: 0,
      default: 1,
    },
    gap: '0.5rem',
    paddingBlock: 0,
    paddingInline: {
      [compactSearch]: 0,
      default: '0.625rem 0.5rem',
    },
    transition: 'border-color 140ms ease, color 140ms ease, background-color 140ms ease',
    alignItems: 'center',
    backgroundColor: {
      [compactSearch]: {
        'default': 'transparent',
        ':hover': 'var(--docs-surface-hover)',
      },
      'default': 'var(--docs-surface-raised)',
      ':hover': 'var(--docs-surface-hover)',
    },
    color: {
      'default': 'var(--docs-text-subtle)',
      ':hover': 'var(--docs-text-primary)',
    },
    cursor: 'pointer',
    display: 'flex',
    justifyContent: {
      [compactSearch]: 'center',
      default: null,
    },
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
    minHeight: '2rem',
    minWidth: {
      [compactSearch]: '2rem',
      default: null,
    },
    width: {
      [compactSearch]: '2rem',
      default: '15rem',
    },
  },
  searchHotkey: {
    display: {
      [compactSearch]: 'none',
      default: null,
    },
    marginInlineStart: 'auto',
  },
  searchLabel: {
    display: {
      [compactSearch]: 'none',
      default: null,
    },
    fontSize: '0.8125rem',
  },
});
