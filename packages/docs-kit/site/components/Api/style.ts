import * as stylex from '@stylexjs/stylex';

const mobile = '@media (width <= 47.5rem)';

const prose = {
  margin: 0,
  color: 'var(--docs-text-secondary)',
  fontSize: '0.8125rem',
  lineHeight: 1.5,
  maxWidth: 'none',
} as const;

export const styles = stylex.create({
  caption: {
    paddingBlock: '0.5rem',
    paddingInline: {
      default: '0.875rem',
      [mobile]: '0.75rem',
    },
    borderBlockEndColor: 'var(--docs-border-subtle)',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    color: 'var(--docs-text-primary)',
    fontSize: '0.8125rem',
    fontWeight: 640,
    letterSpacing: '-0.015em',
  },
  card: {
    borderColor: 'var(--docs-border-default)',
    borderRadius: 'var(--docs-radius-lg)',
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'var(--docs-surface-raised)',
    boxShadow: 'var(--docs-shadow-inset)',
  },
  code: {
    color: 'var(--docs-text-primary)',
    fontFamily: 'var(--docs-font-mono)',
    fontSize: '0.75rem',
  },
  componentDetails: {
    marginInline: 0,
    alignItems: 'baseline',
    columnGap: '1rem',
    display: 'flex',
    flexWrap: 'wrap',
    marginBlockEnd: '1rem',
    marginBlockStart: '-0.25rem',
    rowGap: '0.5rem',
  },
  definition: {
    margin: 0,
    gap: '0.25rem',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  description: {
    marginInline: 0,
    color: 'var(--docs-text-secondary)',
    lineHeight: 1.7,
    marginBlockEnd: '1rem',
    marginBlockStart: 0,
    textWrap: 'pretty',
    maxWidth: '68ch',
  },
  detailDeprecated: {
    alignItems: 'baseline',
    color: 'var(--docs-text-secondary)',
    columnGap: '0.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: '0.8125rem',
    rowGap: '0.375rem',
  },
  empty: {
    margin: 0,
    paddingBlock: '0.75rem',
    paddingInline: {
      default: '0.875rem',
      [mobile]: '0.75rem',
    },
    color: 'var(--docs-text-subtle)',
    fontSize: '0.8125rem',
    textAlign: 'center',
    maxWidth: 'none',
  },
  flag: {
    color: 'var(--docs-accent)',
    fontSize: '0.625rem',
    fontWeight: 650,
    letterSpacing: '0.045em',
    textTransform: 'uppercase',
  },
  flagDeprecated: {
    color: 'var(--docs-danger-text, #b42318)',
    fontSize: '0.625rem',
    fontWeight: 650,
    letterSpacing: '0.045em',
    textTransform: 'uppercase',
  },
  footnote: {
    margin: 0,
    paddingBlock: '0.375rem',
    paddingInline: {
      default: '0.875rem',
      [mobile]: '0.75rem',
    },
    backgroundColor: 'color-mix(in srgb, var(--docs-surface-muted) 55%, transparent)',
    borderBlockStartColor: 'var(--docs-border-subtle)',
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    color: 'var(--docs-text-subtle)',
    fontSize: '0.75rem',
    maxWidth: 'none',
  },
  list: {
    margin: 0,
  },
  origin: {
    color: 'var(--docs-text-subtle)',
    fontSize: '0.7188rem',
  },
  propertyName: {
    borderColor: 'var(--docs-border-subtle)',
    borderRadius: 'var(--docs-radius-sm)',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBlock: '0.125rem',
    paddingInline: '0.375rem',
    backgroundColor: 'var(--docs-surface-muted)',
    color: 'var(--docs-text-primary)',
    fontFamily: 'var(--docs-font-mono)',
    fontSize: '0.75rem',
    overflowWrap: 'anywhere',
  },
  prose,
  proseDefault: {
    ...prose,
    color: 'var(--docs-text-subtle)',
  },
  root: {
    color: 'var(--docs-text-secondary)',
    marginBlockEnd: {
      default: '2rem',
      [mobile]: '1.5rem',
    },
    marginBlockStart: {
      default: '0.75rem',
      [mobile]: '0.5rem',
    },
  },
  row: {
    paddingBlock: '0.5rem',
    paddingInline: {
      default: '0.875rem',
      [mobile]: '0.75rem',
    },
    backgroundColor: {
      'default': null,
      ':hover': 'var(--docs-surface-hover)',
    },
    borderBlockStartColor: 'var(--docs-border-subtle)',
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: {
      'default': 0,
      ':not(:first-child)': 1,
    },
    columnGap: '1rem',
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(8rem, 10rem) minmax(0, 1fr)',
      [mobile]: '1fr',
    },
    rowGap: {
      default: '0.75rem',
      [mobile]: '0.375rem',
    },
  },
  term: {
    alignItems: {
      default: 'flex-start',
      [mobile]: 'baseline',
    },
    columnGap: {
      default: '0.1875rem',
      [mobile]: '0.5rem',
    },
    display: 'flex',
    flexDirection: {
      default: 'column',
      [mobile]: 'row',
    },
    flexWrap: {
      default: null,
      [mobile]: 'wrap',
    },
    rowGap: {
      default: '0.1875rem',
      [mobile]: '0.25rem',
    },
    minWidth: 0,
  },
  type: {
    padding: 0,
    borderWidth: 0,
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    color: 'var(--docs-accent)',
    fontFamily: 'var(--docs-font-mono)',
    fontSize: '0.75rem',
    lineHeight: 1.5,
    overflowWrap: 'break-word',
  },
});
