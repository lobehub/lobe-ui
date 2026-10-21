import * as stylex from '@stylexjs/stylex';

import { tiers } from '../DocsLayout/tiers.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const easeOut = 'cubic-bezier(.2, .8, .2, 1)';

export const styles = stylex.create({
  aside: {
    gridColumn: 3,
    gridRow: 2,
    display: {
      default: null,
      [tiers.narrow]: 'none',
      [tiers.mid]: {
        default: 'none',
        [tiers.finePointer]: 'block',
      },
    },
    insetBlockStart: '2rem',
    marginBlockStart: 'clamp(2.75rem, 6vw, 5rem)',
    paddingInlineStart: {
      default: null,
      [tiers.wide]: '2.5rem',
    },
    position: 'sticky',
    maxHeight: 'calc(var(--docs-viewport-height) - 4rem)',
    minWidth: 0,
  },
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
  highlight: {
    fill: 'none',
    stroke: 'var(--docs-text-primary)',
    strokeLinecap: 'round',
    strokeWidth: 1.5,
    transition: `stroke-dasharray 460ms ${easeOut}, stroke-dashoffset 460ms ${easeOut}`,
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
  },
  highlightRange: (dashArray: string, dashOffset: number) => ({
    strokeDasharray: dashArray,
    strokeDashoffset: dashOffset,
  }),
  link: {
    paddingBlock: '0.3125rem',
    textDecoration: 'none',
    transition: 'color 160ms ease',
    color: {
      'default': 'var(--docs-text-subtle)',
      ':hover': 'var(--docs-text-primary)',
    },
    display: 'block',
    fontSize: '0.8125rem',
    lineHeight: '1.25rem',
    paddingInlineEnd: '0.25rem',
    paddingInlineStart: '1.375rem',
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
  },
  linkActive: {
    color: 'var(--docs-text-primary)',
    fontWeight: 540,
  },
  linkNested: {
    paddingInlineStart: '2.125rem',
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  outline: {
    display: {
      default: 'none',
      [tiers.wide]: 'block',
    },
  },
  pathList: {
    position: 'relative',
  },
  pathSvg: {
    overflow: 'visible',
    insetBlockStart: 0,
    insetInlineStart: 0,
    pointerEvents: 'none',
    position: 'absolute',
    height: '100%',
    width: '1rem',
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
    paddingBlock: '0.125rem',
    paddingInlineEnd: '0.5rem',
    minWidth: 0,
  },
  scrollbar: {
    marginBlock: '0.25rem',
    marginInlineEnd: '0.125rem',
    marginInlineStart: '0',
  },
  track: {
    fill: 'none',
    stroke: 'var(--docs-border-default)',
    strokeLinecap: 'round',
    strokeWidth: 1,
  },
  viewport: {
    maxHeight: 'calc(var(--docs-viewport-height) - 4rem - 1.875rem)',
  },
});
