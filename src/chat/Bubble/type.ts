import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { Ref } from 'react';

export interface BubbleProps extends FlexboxProps {
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}
