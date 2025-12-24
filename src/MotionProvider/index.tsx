'use client';

import type * as m from 'motion/react-m';
import { type Context, type ReactNode, createContext, memo, use } from 'react';

export type MotionComponentType = typeof import('motion/react').motion | typeof m;

export const MotionComponent: Context<MotionComponentType> = createContext<MotionComponentType>(
  null!,
);

export const MotionProvider = memo<{ children: ReactNode; motion: MotionComponentType }>(
  ({ children, motion }) => {
    return <MotionComponent value={motion}>{children}</MotionComponent>;
  },
);

export const useMotionComponent = (): MotionComponentType => {
  const context = use(MotionComponent);
  if (!context) {
    throw new Error(
      'Please wrap your app with <ConfigProvider> (or <MotionProvider>) and pass the motion component',
    );
  }
  return context;
};
