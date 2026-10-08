import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { logoMarqueeMarker } from './marker.stylex';

const slide = stylex.keyframes({
  to: { transform: 'translateX(calc(-100% - var(--logo-marquee-gap)))' },
});

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export const styles = stylex.create({
  caption: {
    margin: 0,
    color: cssVar.colorTextTertiary,
    fontSize: cssVar.fontSizeSM,
  },
  item: {
    gap: 8,
    alignItems: 'center',
    color: cssVar.colorTextTertiary,
    display: 'inline-flex',
    fontSize: cssVar.fontSize,
    whiteSpace: 'nowrap',
  },
  root: {
    gap: 16,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
  },
  track: {
    flex: 'none',
    gap: 'var(--logo-marquee-gap)',
    alignItems: 'center',
    animationDuration: { default: 'var(--logo-marquee-duration)', [reducedMotion]: '0s' },
    animationIterationCount: { default: 'infinite', [reducedMotion]: 1 },
    animationName: { default: slide, [reducedMotion]: 'none' },
    animationPlayState: {
      default: null,
      [stylex.when.ancestor(':hover', logoMarqueeMarker)]: 'paused',
    },
    animationTimingFunction: { default: 'linear', [reducedMotion]: 'ease' },
    display: 'flex',
  },
  viewport: {
    gap: 'var(--logo-marquee-gap)',
    overflow: 'hidden',
    display: 'flex',
    inlineSize: 'min(100%, var(--logo-marquee-max-width))',
    maskImage: 'linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)',
  },
});
