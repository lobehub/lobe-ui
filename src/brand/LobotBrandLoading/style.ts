import * as stylex from '@stylexjs/stylex';

/**
 * One loop: each bubble travels a full ellipse around the head in `ORBIT`, so a bubble passes
 * overhead every `PASS`. Eyes and body run on the `PASS` clock to stay in step with it.
 *
 * The ellipse is built from two sine-eased alternating translations a quarter turn apart
 * (x on the outer group, y on the inner one), which needs no motion path and no JavaScript.
 */
const PASS = '1.4s';
const QUARTER = '-0.7s';
const HALF = '-1.4s';
const THREE_QUARTERS = '-2.1s';

// Close to a true sine in-out, so the two translations trace an ellipse.
const SINE = 'cubic-bezier(0.37, 0, 0.63, 1)';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

const orbitX = stylex.keyframes({
  from: { transform: 'translateX(-129.99px)' },
  to: { transform: 'translateX(129.99px)' },
});

const orbitY = stylex.keyframes({
  from: { transform: 'translateY(50px)' },
  to: { transform: 'translateY(-50px)' },
});

// The bubble is small on the left of the logo and large on the right.
const bubbleGrow = stylex.keyframes({
  from: { transform: 'scale(0.5778)' },
  to: { transform: 'scale(1)' },
});

const haloGrow = stylex.keyframes({
  from: { transform: 'scale(0.7765)' },
  to: { transform: 'scale(1)' },
});

const breathe = stylex.keyframes({
  '0%, 100%': { transform: 'scale(1.012, 0.988)' },
  '50%': { transform: 'scale(0.99, 1.014)' },
});

// Pupils follow the bubble overhead from left to right, then return while the eyes are shut.
const look = stylex.keyframes({
  '0%': { transform: 'translate(-10px, -14px)' },
  '14%': { transform: 'translate(-8.7px, -20px)' },
  '28%': { transform: 'translate(-5px, -24.4px)' },
  '42%': { transform: 'translate(0, -26px)' },
  '56%': { transform: 'translate(5px, -24.4px)' },
  '70%': { transform: 'translate(8.7px, -20px)' },
  '84%': { transform: 'translate(10px, -14px)' },
  '92%': { transform: 'translate(0, -8px)' },
  '100%': { transform: 'translate(-10px, -14px)' },
});

const blink = stylex.keyframes({
  '0%, 84%, 100%': { transform: 'scaleY(1)' },
  '92%': { transform: 'scaleY(0.06)' },
});

const sway = (name: string, delay: string) => ({
  animationDelay: delay,
  animationDirection: 'alternate',
  animationDuration: PASS,
  animationIterationCount: 'infinite',
  animationName: { default: name, [reducedMotion]: 'none' },
  animationTimingFunction: SINE,
});

const loop = (name: string, timing: string) => ({
  animationDuration: PASS,
  animationIterationCount: 'infinite',
  animationName: { default: name, [reducedMotion]: 'none' },
  animationTimingFunction: timing,
});

export const styles = stylex.create({
  body: {
    ...loop(breathe, 'ease-in-out'),
    transformOrigin: '223px 468.4px',
  },
  // Each static transform is the logo pose, which reduced motion falls back to.
  bubbleLarge: {
    ...sway(bubbleGrow, HALF),
  },
  bubbleSmall: {
    ...sway(bubbleGrow, '0s'),
    transform: 'scale(0.5778)',
  },
  eyes: {
    ...loop(blink, 'ease-in-out'),
    transformOrigin: '245.3px 280.48px',
  },
  haloLarge: {
    ...sway(haloGrow, HALF),
  },
  haloSmall: {
    ...sway(haloGrow, '0s'),
    transform: 'scale(0.7765)',
  },
  orbitXLarge: {
    ...sway(orbitX, HALF),
    transform: 'translateX(129.99px)',
  },
  orbitXSmall: {
    ...sway(orbitX, '0s'),
    transform: 'translateX(-129.99px)',
  },
  orbitYLarge: {
    ...sway(orbitY, THREE_QUARTERS),
  },
  orbitYSmall: {
    ...sway(orbitY, QUARTER),
  },
  pupils: {
    ...loop(look, 'linear'),
  },
  root: {
    flex: 'none',
    overflow: 'visible',
    lineHeight: 1,
  },
});
