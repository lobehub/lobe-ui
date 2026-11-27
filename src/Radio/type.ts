import type { Radio as BaseRadio } from '@base-ui/react/radio';
import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';
import type { TextProps } from '@/Text';
import type { DistributiveOmit } from '@/types';

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
  textProps?: DistributiveOmit<TextProps, 'children' | 'className' | 'style'>;
  /**
   * `a2ui`: the A2UI standard radio, a 20px circle that turns into a primary ring when checked,
   * next to a label in the surrounding font size. `size` and `textProps` do not apply.
   * @default 'default'
   */
  variant?: 'default' | 'a2ui';
}

export interface RadioGroupOption {
  /** A second line under the label (`variant="a2ui"`). */
  description?: ReactNode;
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
  /** Group label above the options (`variant="a2ui"`). */
  label?: ReactNode;
  onChange?: (value: string) => void;
  options: (string | RadioGroupOption)[];
  /**
   * `variant="a2ui"`: how each option is drawn. `list` is a plain radio and label, `pills` a
   * bordered pill and `cards` a bordered card (with room for a `description`); the chosen pill or
   * card takes a primary border.
   * @default 'list'
   */
  optionVariant?: 'list' | 'pills' | 'cards';
  size?: number;
  style?: CSSProperties;
  textProps?: RadioProps['textProps'];
  /**
   * `a2ui`: the A2UI standard `RadioGroup`: a muted label above the options, 20px ring radios and
   * the `optionVariant` look, sized by the surrounding font size.
   * @default 'default'
   */
  variant?: 'default' | 'a2ui';
}
