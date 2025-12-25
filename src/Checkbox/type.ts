import type { CSSProperties, ReactNode } from 'react';

import type { TextProps } from '@/Text';

export interface CheckboxProps {
  backgroundColor?: string;
  checked?: boolean;
  children?: ReactNode;
  className?: string;
  classNames?: {
    checkbox?: string;
    text?: string;
    wrapper?: string;
  };
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  shape?: 'square' | 'circle';
  size?: number;
  style?: CSSProperties;
  styles?: {
    checkbox?: CSSProperties;
    text?: CSSProperties;
    wrapper?: CSSProperties;
  };
  textProps?: Omit<TextProps, 'children' | 'className' | 'style'>;
}
