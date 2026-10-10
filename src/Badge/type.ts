import type { ComponentProps, ReactNode, Ref } from 'react';

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';

export type BadgeSize = 'default' | 'small';

export interface BadgeProps extends Omit<ComponentProps<'span'>, 'color'> {
  color?: string;
  count?: ReactNode;
  dot?: boolean;
  offset?: [number, number];
  overflowCount?: number;
  ref?: Ref<HTMLSpanElement>;
  showZero?: boolean;
  size?: BadgeSize;
  status?: BadgeStatus;
  text?: ReactNode;
}
