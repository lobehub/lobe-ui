import * as stylex from '@stylexjs/stylex';

import { tiers } from '../DocsLayout/tiers.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const mobile = '@media (width <= 47.5rem)';
const easeOut = 'cubic-bezier(.2, .8, .2, 1)';

export const styles = stylex.create({
  bar: {
    gridRow: 1,
    paddingInline: {
      default: '1.5rem',
      [mobile]: '1rem',
    },
    alignItems: 'center',
    backdropFilter: 'saturate(1.6) blur(12px)',
    backgroundColor: 'color-mix(in srgb, var(--lobe-color-bg-container) 82%, transparent)',
    borderBlockEndColor: 'var(--docs-border-subtle)',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: {
      default: 'none',
      [tiers.narrow]: 'flex',
      [tiers.mid]: {
        default: 'flex',
        [tiers.finePointer]: 'none',
      },
    },
    gridColumnEnd: -1,
    gridColumnStart: 1,
    insetBlockStart: 0,
    position: 'sticky',
    zIndex: 10,
    height: '2.75rem',
  },
  chevron: {
    transition: `transform 200ms ${easeOut}`,
    color: 'var(--docs-text-subtle)',
    flexShrink: 0,
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  popup: {
    paddingBlock: '0.25rem',
    maxHeight: 'min(60vh, 26rem)',
    overflowY: 'auto',
    width: 'min(20rem, calc(100vw - 2rem))',
  },
  ring: {
    flexShrink: 0,
    transform: 'rotate(-90deg)',
    height: 16,
    width: 16,
  },
  ringOffset: (circumference: number, offset: number) => ({
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset,
  }),
  ringTrack: {
    fill: 'none',
    stroke: 'var(--docs-border-default)',
    strokeWidth: 2,
  },
  ringValue: {
    fill: 'none',
    stroke: 'var(--docs-text-primary)',
    strokeLinecap: 'round',
    strokeWidth: 2,
    transition: `stroke-dashoffset 460ms ${easeOut}`,
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
  },
  title: {
    overflow: 'hidden',
    color: 'var(--docs-text-primary)',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  trigger: {
    font: 'inherit',
    borderRadius: 'var(--docs-radius-md)',
    borderWidth: 0,
    gap: '0.5rem',
    marginInline: '-0.5rem',
    paddingBlock: 0,
    paddingInline: '0.5rem',
    transition: 'background-color 140ms ease',
    alignItems: 'center',
    backgroundColor: {
      'default': 'transparent',
      ':hover': 'var(--docs-surface-hover)',
    },
    color: 'var(--docs-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '0.8125rem',
    fontWeight: 540,
    height: '2rem',
    maxWidth: '100%',
    minWidth: 0,
  },
});
