import * as stylex from '@stylexjs/stylex';

import { headingMarker, paginationMarker } from './markers.stylex';
import { tiers } from './tiers.stylex';

const mobile = '@media (width <= 47.5rem)';
const withToc = ':has([data-docs-toc])';

export const styles = stylex.create({
  description: {
    marginInline: 0,
    color: 'var(--docs-text-secondary)',
    fontSize: '1rem',
    lineHeight: 1.7,
    marginBlockEnd: 0,
    marginBlockStart: '0.75rem',
    textWrap: 'pretty',
    maxWidth: '42rem',
  },
  document: {
    gridColumn: 2,
    gridRow: 2,
    paddingBlockStart: 'clamp(2.75rem, 6vw, 5rem)',
    minWidth: 0,
    width: '100%',
  },
  header: {
    borderBlockEndColor: 'var(--docs-border-subtle)',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    marginBlockEnd: {
      default: '2.5rem',
      [mobile]: '2rem',
    },
    paddingBlockEnd: {
      default: '2rem',
      [mobile]: '1.5rem',
    },
  },
  headingAnchor: {
    textDecoration: 'none',
    transition: 'opacity 140ms ease',
    alignItems: 'center',
    color: {
      'default': 'var(--docs-text-subtle)',
      ':hover': 'var(--docs-accent)',
    },
    display: 'inline-flex',
    marginInlineStart: '0.375rem',
    opacity: {
      'default': 0,
      [stylex.when.ancestor(':hover', headingMarker)]: 1,
      ':focus-visible': 1,
    },
    verticalAlign: 'middle',
  },
  importBlock: {
    marginBlockStart: '1.25rem',
    maxWidth: '100%',
    width: 'fit-content',
  },
  link: {
    gap: '0.125rem',
    textDecoration: 'none',
    transition: 'color 140ms ease',
    alignItems: 'center',
    color: {
      'default': 'var(--docs-text-subtle)',
      ':hover': 'var(--docs-text-primary)',
    },
    display: 'inline-flex',
    fontSize: '0.8125rem',
    fontWeight: 500,
  },
  linkIcon: {
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
    marginInlineEnd: '0.25rem',
  },
  links: {
    gap: '1.25rem',
    alignItems: 'center',
    display: 'flex',
    marginBlockStart: '1rem',
  },
  pagination: {
    gap: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    marginBlockStart: '3rem',
  },
  paginationArrow: {
    transition: 'color 140ms ease',
    color: {
      default: 'var(--docs-text-subtle)',
      [stylex.when.ancestor(':hover', paginationMarker)]: 'var(--docs-text-primary)',
    },
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
  },
  paginationLabel: {
    color: 'var(--docs-text-subtle)',
    fontSize: '0.7188rem',
  },
  paginationLink: {
    gap: '0.625rem',
    textDecoration: 'none',
    alignItems: 'center',
    display: 'inline-flex',
    minWidth: 0,
  },
  paginationLinkNext: {
    textAlign: 'end',
  },
  paginationText: {
    gap: '0.125rem',
    display: 'grid',
    minWidth: 0,
  },
  paginationTitle: {
    overflow: 'hidden',
    transition: 'color 140ms ease',
    color: {
      default: 'var(--docs-text-secondary)',
      [stylex.when.ancestor(':hover', paginationMarker)]: 'var(--docs-text-primary)',
    },
    fontSize: '0.875rem',
    fontWeight: 560,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  grid: {
    alignItems: 'start',
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr min(64rem, 100% - 3rem) 1fr',
      [mobile]: '1fr min(64rem, 100% - 2rem) 1fr',
      [tiers.mid]: {
        default: '1fr min(64rem, 100% - 3rem) 1fr',
        [withToc]: '1fr min(64rem, 100% - 6rem) 3rem 1fr',
      },
      [tiers.wide]: {
        default: '1fr min(64rem, 100% - 3rem) 1fr',
        [withToc]: '1fr min(64rem, 100% - 18.5rem) 15.5rem 1fr',
      },
    },
  },
  root: {
    marginBlock: 0,
    paddingInline: 0,
    containerName: 'docs',
    containerType: 'inline-size',
    paddingBlockEnd: {
      default: '7rem',
      [mobile]: '5rem',
    },
    paddingBlockStart: 0,
    width: '100%',
  },
  searchMetadata: {
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    position: 'absolute',
    whiteSpace: 'nowrap',
    height: 1,
    width: 1,
  },
  title: {
    margin: 0,
    color: 'var(--docs-text-primary)',
    fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
    fontWeight: 660,
    letterSpacing: '-0.045em',
    lineHeight: 1.08,
    textWrap: 'balance',
    maxWidth: {
      default: '20ch',
      [mobile]: '18ch',
    },
  },
});
