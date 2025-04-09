import type { Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

export interface GridProps extends Omit<FlexboxProps, 'gap'> {
  gap?: string | number;
  maxItemWidth?: string | number;
  ref?: Ref<HTMLDivElement>;
  rows?: number;
}
