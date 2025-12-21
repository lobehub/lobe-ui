import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { Ref } from 'react';

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
