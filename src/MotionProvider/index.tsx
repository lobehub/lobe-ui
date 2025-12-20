'use client';

import { motion as defaultMotion } from 'motion/react';
import { type Context, type ReactNode, createContext, memo, use } from 'react';

export type MotionComponentType = typeof import('motion/react').motion;

export const MotionComponent: Context<MotionComponentType> = createContext<MotionComponentType>(
  defaultMotion as MotionComponentType,
);

export const MotionProvider = memo<{ children: ReactNode; motion?: MotionComponentType }>(
  ({ children, motion = defaultMotion }) => {
    return <MotionComponent value={motion}>{children}</MotionComponent>;
  },
);

export const useMotionComponent = (): MotionComponentType => {
  return use(MotionComponent);
};
