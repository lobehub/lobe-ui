import type { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';
import type { TextProps } from '@/Text';

export type CheckboxShape = 'square' | 'circle';

type BaseCheckboxProps = Omit<
  ComponentProps<typeof BaseCheckbox.Root>,
  'className' | 'style' | 'render' | 'children' | 'onCheckedChange'
>;

export interface CheckboxProps extends BaseCheckboxProps {
  backgroundColor?: string;
  children?: ReactNode;
  className?: string;
  classNames?: {
    checkbox?: string;
    text?: string;
    wrapper?: string;
  };
  onChange?: (checked: boolean) => void;
  shape?: CheckboxShape;
  /**
   * Box size in pixels
   * @default 16
   */
  size?: number;
  style?: CSSProperties;
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

type BaseCheckboxGroupProps = Omit<
  ComponentProps<typeof BaseCheckboxGroup>,
  'className' | 'style' | 'render' | 'children' | 'onValueChange' | 'onChange'
>;

export interface CheckboxGroupProps
  extends BaseCheckboxGroupProps, Pick<FlexboxProps, 'gap' | 'horizontal'> {
  className?: string;
  onChange?: (value: string[]) => void;
  options: (string | CheckboxGroupOption)[];
  shape?: CheckboxShape;
  size?: number;
  style?: CSSProperties;
  textProps?: CheckboxProps['textProps'];
}
