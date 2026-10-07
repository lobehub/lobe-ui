import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const nodePulse = stylex.keyframes({
  '0%, 100%': { opacity: 0.3 },
  '50%': { opacity: 1 },
});

const particleFlow = stylex.keyframes({
  '0%': { opacity: 0.5, transform: 'translateX(0)' },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5, transform: 'translateX(50px)' },
});

const coreBreath = stylex.keyframes({
  '0%, 100%': { opacity: 0.5, transform: 'scale(0.8)' },
  '50%': { opacity: 1, transform: 'scale(1)' },
});

const ringSpin = stylex.keyframes({
  to: { transform: 'rotate(360deg)' },
});

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

const loop = (name: string, duration: string, timing: string) => ({
  animationDuration: { default: duration, [reducedMotion]: '0s' },
  animationIterationCount: { default: 'infinite', [reducedMotion]: 1 },
  animationName: { default: name, [reducedMotion]: 'none' },
  animationTimingFunction: { default: timing, [reducedMotion]: 'ease' },
});

export const styles = stylex.create({
  glyph: {
    display: 'inline-flex',
  },
  glyphBox: {
    display: 'inline-flex',
  },
  network: {
    display: 'inline-block',
    position: 'relative',
  },
  networkBox: {
    insetBlockStart: 0,
    insetInlineStart: 0,
    position: 'absolute',
    transformOrigin: '0 0',
    height: 100,
    width: 100,
  },
  networkCore: {
    ...loop(coreBreath, '2s', 'ease'),
    backgroundColor: 'currentcolor',
    insetBlockStart: 47,
    insetInlineStart: 47,
    position: 'absolute',
    height: 6,
    width: 6,
  },
  networkLine: {
    stroke: 'currentcolor',
    strokeWidth: 0.5,
    opacity: 0.3,
  },
  networkLines: {
    inset: 0,
    position: 'absolute',
    height: 100,
    width: 100,
  },
  networkNode: {
    ...loop(nodePulse, '2s', 'ease'),
    margin: 'calc(var(--spin-node-size) / -2)',
    borderRadius: '50%',
    backgroundColor: 'currentcolor',
    position: 'absolute',
    height: 'var(--spin-node-size)',
    width: 'var(--spin-node-size)',
  },
  networkParticle: {
    ...loop(particleFlow, '2s', 'ease'),
    margin: 'calc(var(--spin-particle-size) / -2)',
    borderRadius: '50%',
    backgroundColor: 'currentcolor',
    insetBlockStart: 50,
    insetInlineStart: 25,
    position: 'absolute',
    height: 'var(--spin-particle-size)',
    width: 'var(--spin-particle-size)',
  },
  networkRing: {
    ...loop(ringSpin, '20s', 'linear'),
    inset: 10,
    borderColor: 'currentcolor',
    borderRadius: '50%',
    borderStyle: 'dashed',
    borderWidth: 1,
    opacity: 0.4,
    position: 'absolute',
  },
  overlay: {
    inset: 0,
    gap: 8,
    alignItems: 'center',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 70%, transparent)`,
    color: cssVar.colorTextSecondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
  },
  ring: {
    rotate: '-90deg',
  },
  ringProgress: {
    stroke: cssVar.colorPrimary,
  },
  ringTrack: {
    stroke: cssVar.colorFillTertiary,
  },
  root: {
    alignItems: 'center',
    color: cssVar.colorTextSecondary,
    display: 'inline-flex',
  },
  tip: {
    color: cssVar.colorTextSecondary,
    fontSize: cssVar.fontSizeSM,
  },
  wrapper: {
    position: 'relative',
  },
});
