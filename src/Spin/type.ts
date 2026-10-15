import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

export type SpinSize = 'small' | 'middle' | 'large' | number;

export type SpinVariant = 'default' | 'network';

export interface SpinProps extends Omit<ComponentProps<'div'>, 'children'> {
  children?: ReactNode;
  indicator?: ReactNode;
  percent?: number;
  ref?: Ref<HTMLDivElement>;
  size?: SpinSize;
  spinning?: boolean;
  style?: CSSProperties;
  tip?: ReactNode;
  variant?: SpinVariant;
}
