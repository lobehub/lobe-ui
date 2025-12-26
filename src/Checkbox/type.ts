import type { CSSProperties, ReactNode } from 'react';

import { FlexboxProps } from '@/Flex';
import type { TextProps } from '@/Text';
import { DivProps } from '@/types';

export interface CheckboxProps extends Omit<DivProps, 'onChange'> {
  backgroundColor?: string;
  checked?: boolean;
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
  styles?: {
    checkbox?: CSSProperties;
    text?: CSSProperties;
    wrapper?: CSSProperties;
  };
  textProps?: Omit<TextProps, 'children' | 'className' | 'style'>;
}

export interface CheckboxGroupOption {
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface CheckboxGroupProps extends Omit<FlexboxProps, 'defaultValue' | 'onChange'> {
  defaultValue?: string[];
  disabled?: boolean;
  onChange?: (value: string[]) => void;
  options: string[] | CheckboxGroupOption[];
  shape?: 'square' | 'circle';
  size?: number;
  textProps?: Omit<TextProps, 'children' | 'className' | 'style'>;
  value?: string[];
}
