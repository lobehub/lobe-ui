import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { Ref } from 'react';

export interface BlockProps extends FlexboxProps {
  clickable?: boolean;
  glass?: boolean;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}
