import type { MotionProps } from 'motion/react';

const enterStyle = { opacity: 1, scale: 1 };
const initialStyle = { opacity: 0, scale: 0.96 };

export const modalMotionConfig: MotionProps = {
  animate: enterStyle,
  exit: {
    ...initialStyle,
    transition: { duration: 0.15 },
  },
  initial: initialStyle,
  transition: {
    damping: 20,
    stiffness: 300,
    type: 'spring',
  },
};

export const backdropTransition = { duration: 0.15 };
