import * as stylex from '@stylexjs/stylex';

// Spring baked as linear(): stiffness 460 / damping 53 / mass 2.3, zeta ~0.81
// with 1.2% overshoot. The duration is the spring's settle time — change them
// together with the curve, not independently.
export const toastDodge = stylex.defineConsts({
  duration: '608ms',
  ease: 'linear(0, 0.08, 0.249, 0.437, 0.607, 0.745, 0.847, 0.917, 0.963, 0.99, 1.004, 1.011, 1.012, 1.011, 1.009, 1.007, 1.005, 1.003, 1.002, 1)',
});
