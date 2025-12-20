import { LazyMotion as MotionLazyMotion } from 'motion/react';
import type { ComponentProps } from 'react';

/**
 * Shared lazy-loaded Motion features bundle.
 * Using a dynamic import keeps the initial bundle lighter and avoids repeating this logic across components.
 */
type MotionLazyMotionProps = ComponentProps<typeof MotionLazyMotion>;

export const loadFeatures: MotionLazyMotionProps['features'] = () =>
  import('motion/react').then((res) => (res as any).domAnimation);
