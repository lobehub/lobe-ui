import type { MotionProps } from 'motion/react';

type CubicBezier = [number, number, number, number];

const softEase: CubicBezier = [0.32, 0.72, 0, 1];
const exitEase: CubicBezier = [0.4, 0, 1, 1];

const initialStyle = { opacity: 0, scale: 0.97 };
const enterStyle = { opacity: 1, scale: 1 };
const exitStyle = { opacity: 0, scale: 0.98 };

export const modalMotionConfig: MotionProps = {
  animate: enterStyle,
  exit: {
    ...exitStyle,
    transition: { duration: 0.12, ease: exitEase },
  },
  initial: initialStyle,
  transition: {
    duration: 0.22,
    ease: softEase,
  },
};

export const backdropTransition = {
  duration: 0.18,
  ease: softEase,
};
