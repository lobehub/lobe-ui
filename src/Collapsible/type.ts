import type { CSSProperties, ReactNode } from 'react';

export interface CollapsibleProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  keepMounted?: boolean;
  open: boolean;
  style?: CSSProperties;
}
