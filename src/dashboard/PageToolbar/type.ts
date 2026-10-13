import type { ReactNode } from 'react';

export interface PageToolbarProps {
  /** Right side: refresh, export, the page's own buttons. */
  actions?: ReactNode;
  /** Left side: range, scope, search, whatever narrows the page. */
  children?: ReactNode;
  className?: string;
}
