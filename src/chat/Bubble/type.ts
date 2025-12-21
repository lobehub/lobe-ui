import type { Ref } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface BubbleProps extends FlexboxProps {
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}
