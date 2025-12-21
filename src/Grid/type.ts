import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { Ref } from 'react';

export interface GridProps extends Omit<FlexboxProps, 'gap'> {
  gap?: string | number;
  maxItemWidth?: string | number;
  ref?: Ref<HTMLDivElement>;
  rows?: number;
}
