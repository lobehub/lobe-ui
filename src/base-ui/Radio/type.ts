import type { Radio as BaseRadio } from '@base-ui/react/radio';
import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';
import type { TextProps } from '@/Text';

type BaseRadioProps = Omit<
  ComponentProps<typeof BaseRadio.Root>,
  'className' | 'style' | 'render' | 'children'
>;

export interface RadioProps extends BaseRadioProps {
  backgroundColor?: string;
  children?: ReactNode;
  className?: string;
  classNames?: {
    radio?: string;
    text?: string;
    wrapper?: string;
  };
  /**
   * Dot size in pixels
   * @default 16
   */
  size?: number;
  style?: CSSProperties;
  styles?: {
    radio?: CSSProperties;
    text?: CSSProperties;
    wrapper?: CSSProperties;
  };
  textProps?: Omit<TextProps, 'children' | 'className' | 'style'>;
}

export interface RadioGroupOption {
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

type BaseRadioGroupProps = Omit<
  BaseRadioGroup.Props<string>,
  'className' | 'style' | 'render' | 'children' | 'onValueChange' | 'onChange'
>;

export interface RadioGroupProps extends BaseRadioGroupProps {
  className?: string;
  /**
   * Gap between items
   * @default 12
   */
  gap?: FlexboxProps['gap'];
  /**
   * Row layout
   * @default true
   */
  horizontal?: boolean;
  onChange?: (value: string) => void;
  options: (string | RadioGroupOption)[];
  size?: number;
  style?: CSSProperties;
  textProps?: RadioProps['textProps'];
}
