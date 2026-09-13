import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

export type ProgressType = 'line' | 'circle';

export type ProgressVariant = 'line' | 'segments' | 'inset';

export type ProgressStatus = 'normal' | 'active' | 'success' | 'exception';

export type ProgressSize = 'small' | 'middle' | 'large' | number;

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'children'> {
  className?: string;
  format?: (percent: number) => ReactNode;
  label?: ReactNode;
  percent: number;
  ref?: Ref<HTMLDivElement>;
  segments?: number;
  showInfo?: boolean;
  size?: ProgressSize;
  status?: ProgressStatus;
  strokeColor?: string;
  style?: CSSProperties;
  type?: ProgressType;
  variant?: ProgressVariant;
}
