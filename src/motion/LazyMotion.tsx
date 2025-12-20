'use client';

import { LazyMotion as MotionLazyMotion } from 'motion/react';
import { memo } from 'react';
import type { ComponentProps } from 'react';

import { loadFeatures } from './loadFeatures';

type MotionLazyMotionProps = ComponentProps<typeof MotionLazyMotion>;

export type LobeLazyMotionProps = Omit<MotionLazyMotionProps, 'features'> & {
  /**
   * Optional override for Motion features.
   * Defaults to the shared lazy-loaded `loadFeatures`.
   */
  features?: MotionLazyMotionProps['features'];
};

/**
 * A project-wide `LazyMotion` wrapper that provides a shared default `features` loader.
 */
export const LazyMotion = memo<LobeLazyMotionProps>(({ features, ...props }) => (
  <MotionLazyMotion features={features ?? loadFeatures} {...props} />
));

LazyMotion.displayName = 'LazyMotion';
