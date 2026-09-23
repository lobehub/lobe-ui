import type { ReactNode } from 'react';

import type { DivProps } from '@/types';

export interface InstallBannerProps extends Omit<DivProps, 'title'> {
  /** The shell command users copy, e.g. `pnpm add @lobehub/ui`. */
  command: string;
  /** Muted line under the command, e.g. license and a docs link. */
  footnote?: ReactNode;
  /**
   * Shell prompt shown before the command.
   * @default '$'
   */
  prefix?: string;
  title?: ReactNode;
}
