import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

const thoughtRise = stylex.keyframes({
  '0%, 100%': { opacity: 0.35, transform: 'translate(0, 1.2px) scale(0.82)' },
  '45%': { opacity: 1, transform: 'translate(0, -0.8px) scale(1)' },
});

const badgePulse = stylex.keyframes({
  '0%, 18%, 100%': { transform: 'scale(1)' },
  '9%': { transform: 'scale(1.1)' },
});

export const styles = stylex.create({
  badge: {
    transformBox: 'fill-box',
    transformOrigin: 'center',
  },
  badgeDot: {
    fill: cssVar.colorError,
  },
  badgeMark: {
    fill: cssVar.colorTextLightSolid,
  },
  badgeMotion: {
    animationDuration: '2.2s',
    animationIterationCount: 'infinite',
    animationName: { default: badgePulse, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  badgeRing: {
    fill: cssVar.colorBgContainer,
  },
  body: {
    fill: 'var(--lobe-agent-avatar-color)',
  },
  root: {
    flex: 'none',
    overflow: 'visible',
    display: 'block',
    height: 40,
    width: 40,
  },
  thoughtDot: {
    fill: 'var(--lobe-agent-avatar-color)',
    stroke: cssVar.colorBgContainer,
    strokeWidth: 2.5,
    paintOrder: 'stroke',
    transformBox: 'fill-box',
    transformOrigin: 'center',
  },
  thoughtMotion: {
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationName: { default: thoughtRise, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
});
