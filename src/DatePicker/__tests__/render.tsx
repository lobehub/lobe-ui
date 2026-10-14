import {
  render as baseRender,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';

import { MotionProvider } from '@/MotionProvider';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);

export const render = (ui: ReactElement, options?: RenderOptions): RenderResult =>
  baseRender(ui, { wrapper: Wrapper, ...options });
