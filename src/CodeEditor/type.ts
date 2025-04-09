import type { CSSProperties, Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

import type { TextAreaProps } from '@/types';

export interface CodeEditorProps
  extends TextAreaProps,
    Pick<FlexboxProps, 'width' | 'height' | 'flex'> {
  classNames?: {
    highlight?: string;
    textarea?: string;
  };
  defaultValue?: string;
  language: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  ref?: Ref<HTMLTextAreaElement>;
  style?: CSSProperties;
  styles?: {
    highlight?: CSSProperties;
    textarea?: CSSProperties;
  };
  value: string;
  variant?: 'filled' | 'outlined' | 'borderless';
}
