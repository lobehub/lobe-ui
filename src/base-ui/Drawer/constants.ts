import type { MotionProps } from 'motion/react';

import type { DrawerPlacement } from './type';

type CubicBezier = [number, number, number, number];

const softEase: CubicBezier = [0.32, 0.72, 0, 1];
const exitEase: CubicBezier = [0.4, 0, 1, 1];

export const DEFAULT_PUSH_DISTANCE = 180;
export const DEFAULT_SIDEBAR_WIDTH = 280;
export const DEFAULT_CONTAINER_MAX_WIDTH = 1024;
export const DEFAULT_DRAWER_WIDTH = 378;
export const DEFAULT_DRAWER_HEIGHT = 378;

const offscreen: Record<DrawerPlacement, MotionProps['initial']> = {
  bottom: { y: '100%' },
  left: { x: '-100%' },
  right: { x: '100%' },
  top: { y: '-100%' },
};

export const pushAxis: Record<DrawerPlacement, { axis: 'x' | 'y'; sign: 1 | -1 }> = {
  bottom: { axis: 'y', sign: -1 },
  left: { axis: 'x', sign: 1 },
  right: { axis: 'x', sign: -1 },
  top: { axis: 'y', sign: 1 },
};

export const getDrawerMotionConfig = (
  placement: DrawerPlacement,
  pushOffset = 0,
): MotionProps & { animate: { x: number; y: number } } => {
  const hidden = offscreen[placement];
  const { axis, sign } = pushAxis[placement];
  const shift = pushOffset === 0 ? 0 : pushOffset * sign;

  return {
    animate: axis === 'x' ? { x: shift, y: 0 } : { x: 0, y: shift },
    exit: {
      ...(hidden as object),
      transition: { duration: 0.22, ease: exitEase },
    },
    initial: hidden,
    transition: { duration: 0.3, ease: softEase },
  };
};

export const drawerBackdropTransition = {
  duration: 0.18,
  ease: softEase,
};
