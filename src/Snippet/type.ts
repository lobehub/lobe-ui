import type { Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

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
