import * as stylex from '@stylexjs/stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export const styles = stylex.create({
  heading: {
    marginInline: 0,
    color: 'var(--docs-text-primary)',
    fontSize: '0.75rem',
    fontWeight: 620,
    letterSpacing: '-0.005em',
    lineHeight: '1.25rem',
    marginBlockEnd: '0.625rem',
    marginBlockStart: 0,
  },
  link: {
    'textDecoration': 'none',
    'transition': 'color 140ms ease',
    'alignItems': 'center',
    'color': {
      'default': 'var(--docs-text-subtle)',
      ':hover': 'var(--docs-text-primary)',
    },
    'display': 'flex',
    'fontSize': '0.8125rem',
    'lineHeight': '1.25rem',
    'paddingInlineStart': '0.875rem',
    'position': 'relative',
    'transitionDuration': { default: null, [reducedMotion]: '0.01ms' },
    'minHeight': '1.875rem',
    '::before': {
      insetBlock: '0.375rem',
      transition: 'opacity 140ms ease',
      backgroundColor: 'var(--docs-text-primary)',
      content: '""',
      insetInlineStart: -1,
      opacity: 0,
      position: 'absolute',
      width: 1,
    },
  },
  linkActive: {
    'color': 'var(--docs-text-primary)',
    'fontWeight': 540,
    '::before': {
      opacity: 1,
    },
  },
  linkNested: {
    paddingInlineStart: '1.625rem',
  },
  list: {
    margin: 0,
    padding: 0,
    gap: '0.125rem',
    listStyle: 'none',
    borderInlineStartColor: 'var(--docs-border-subtle)',
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
    display: 'grid',
  },
  root: {
    gridColumn: 3,
    overflow: 'hidden',
    placeSelf: 'start end',
    display: {
      'default': null,
      '@container docs (width < 87rem)': 'none',
    },
    insetBlockStart: '2rem',
    marginBlockStart: 'clamp(2.75rem, 6vw, 5rem)',
    marginInlineEnd: '1.5rem',
    position: 'sticky',
    maxHeight: 'calc(var(--docs-viewport-height) - 4rem)',
    maxWidth: 'calc(100% - 1.5rem)',
  },
  scrollArea: {
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    maxHeight: 'calc(var(--docs-viewport-height) - 4rem - 1.875rem)',
    width: '100%',
  },
  scrollContent: {
    gap: 0,
    paddingInlineEnd: '0.5rem',
    minWidth: 0,
  },
  scrollbar: {
    marginBlock: '0.25rem',
    marginInlineEnd: '0.125rem',
    marginInlineStart: '0',
  },
  viewport: {
    maxHeight: 'calc(var(--docs-viewport-height) - 4rem - 1.875rem)',
  },
});
