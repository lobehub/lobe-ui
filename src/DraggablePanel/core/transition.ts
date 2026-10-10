import type { Transition } from 'motion/react';

import { reducedMotion } from './env';

export const TRANSITION: Transition = {
  duration: 0.25,
  ease: [0.32, 0.72, 0, 1],
};

const INSTANT: Transition = { duration: 0 };

export const timing = (transition?: Transition): Transition =>
  reducedMotion.get() ? INSTANT : (transition ?? TRANSITION);
