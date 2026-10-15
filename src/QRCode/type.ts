import type { ComponentProps, ReactNode, Ref } from 'react';

export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H';
export type QRCodeStatus = 'active' | 'loading' | 'expired';

export interface QRCodeProps extends Omit<ComponentProps<'div'>, 'children'> {
  bgColor?: string;
  bordered?: boolean;
  color?: string;
  errorLevel?: QRCodeErrorLevel;
  icon?: ReactNode;
  onRefresh?: () => void;
  ref?: Ref<HTMLDivElement>;
  size?: number;
  status?: QRCodeStatus;
  value: string;
}
