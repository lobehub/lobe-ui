import type { ReactNode } from 'react';

export interface PageHeaderProps {
  /** Actions at the end of the header. Falls back to `children`. */
  action?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  /** Mark beside the title, such as an avatar. */
  mark?: ReactNode;
  title: ReactNode;
}
