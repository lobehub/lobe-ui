import type { ReactNode } from 'react';

export interface FloatingSheetProps {
  activeSnapPoint?: number;
  children?: ReactNode;
  className?: string;
  closeThreshold?: number;
  defaultOpen?: boolean;
  dismissible?: boolean;
  headerActions?: ReactNode;
  maxHeight?: number;
  minHeight?: number;
  mode?: 'overlay' | 'push';
  onOpenChange?: (open: boolean) => void;
  onSnapPointChange?: (snapPoint: number) => void;
  open?: boolean;
  snapPoints?: number[];
  title?: ReactNode;
  variant?: 'elevated' | 'embedded';
  width?: number | string;
}
