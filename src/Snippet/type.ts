import type { Ref } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface SnippetProps extends FlexboxProps {
  children: string;
  copyable?: boolean;
  language?: string;
  prefix?: string;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  spotlight?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}
