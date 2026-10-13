import type { ReactNode } from 'react';

export interface TitleWithTipsProps {
  className?: string;
  /** Tooltip shown on the info icon. */
  tips: ReactNode;
  title: ReactNode;
}
