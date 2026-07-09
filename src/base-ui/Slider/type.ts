import type { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps, CSSProperties } from 'react';

import type { InputNumberProps, InputVariant } from '@/base-ui/Input';
import type { FlexboxProps } from '@/Flex';

type BaseSliderProps = Omit<
  ComponentProps<typeof BaseSlider.Root>,
  | 'className'
  | 'style'
  | 'render'
  | 'children'
  | 'onValueChange'
  | 'value'
  | 'defaultValue'
  | 'onChange'
>;

export interface SliderProps extends BaseSliderProps {
  className?: string;
  classNames?: {
    control?: string;
    indicator?: string;
    thumb?: string;
    track?: string;
  };
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeComplete?: (value: number) => void;
  style?: CSSProperties;
  styles?: {
    control?: CSSProperties;
    indicator?: CSSProperties;
    thumb?: CSSProperties;
    track?: CSSProperties;
  };
  value?: number;
}

export interface SliderWithInputProps extends Omit<SliderProps, 'classNames' | 'styles'> {
  changeOnWheel?: boolean;
  classNames?: SliderProps['classNames'] & {
    input?: string;
    slider?: string;
  };
  controls?: boolean;
  gap?: FlexboxProps['gap'];
  shadow?: boolean;
  size?: InputNumberProps['size'];
  styles?: SliderProps['styles'] & {
    input?: CSSProperties;
    slider?: CSSProperties;
  };
  unlimitedInput?: boolean;
  variant?: InputVariant;
}
