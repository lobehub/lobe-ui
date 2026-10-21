import * as stylex from '@stylexjs/stylex';

import { tiers } from '../DocsLayout/tiers.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const easeOut = 'cubic-bezier(.2, .8, .2, 1)';

export const styles = stylex.create({
  bar: {
    borderRadius: 1,
    transition: `width 200ms ${easeOut}, background-color 200ms ease`,
    backgroundColor: 'var(--docs-border-strong)',
    display: 'block',
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
    height: 2,
  },
  barActive: {
    backgroundColor: 'var(--docs-text-primary)',
  },
  barHovered: {
    backgroundColor: 'var(--docs-text-subtle)',
  },
  barWidth: (width: number) => ({
    width,
  }),
  label: {
    borderRadius: 'var(--docs-radius-md)',
    paddingBlock: '0.25rem',
    paddingInline: '0.625rem',
    transition: `top 160ms ${easeOut}`,
    backgroundColor: 'var(--docs-text-primary)',
    boxShadow: '0 6px 20px rgb(0 0 0 / 14%)',
    color: 'var(--docs-background)',
    fontSize: '0.75rem',
    fontWeight: 500,
    insetInlineEnd: 'calc(100% + 0.5rem)',
    lineHeight: '1.125rem',
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translateY(-50%)',
    transitionDuration: { default: null, [reducedMotion]: '0.01ms' },
    whiteSpace: 'nowrap',
    zIndex: 2,
  },
  labelTop: (top: number) => ({
    top,
  }),
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  rail: {
    display: {
      default: 'none',
      [tiers.mid]: {
        default: 'none',
        [tiers.finePointer]: 'block',
      },
    },
    marginInlineStart: 'auto',
    position: 'relative',
    width: '2.5rem',
  },
  tick: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingInlineEnd: '0.25rem',
    height: '0.875rem',
    width: '100%',
  },
});
