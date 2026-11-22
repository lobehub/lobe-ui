import type { ReactNode } from 'react';

import type { DivProps } from '@/types';

export interface LobotProps extends DivProps {
  /**
   * Product or section name shown after a slash divider.
   */
  extra?: ReactNode;
  /**
   * Height of the mark in px. The wordmark, divider and `extra` scale with it.
   * @default 32
   */
  size?: number;
  /**
   * Which part of the lockup to render: the mark, the wordmark, or both.
   * @default 'mono'
   */
  type?: 'mono' | 'text' | 'combine';
}
