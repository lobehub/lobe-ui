import type { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import type { FlexboxProps } from '@/Flex';
import type { InputNumberProps, InputVariant } from '@/Input';

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
  /** Label above the track, with the value on the right (`variant="a2ui"`). */
  label?: ReactNode;
  onChange?: (value: number) => void;
  onChangeComplete?: (value: number) => void;
  style?: CSSProperties;
  styles?: {
    control?: CSSProperties;
    indicator?: CSSProperties;
    thumb?: CSSProperties;
    track?: CSSProperties;
  };
  /** Unit after the shown value, e.g. `%` (`variant="a2ui"`). */
  unit?: ReactNode;
  value?: number;
  /**
   * `a2ui`: the A2UI standard `Slider`, a 24px pill track with a 20px thumb and no filled range,
   * under a row with the `label` and the value (shown with a `label` or `unit`).
   * @default 'default'
   */
  variant?: 'default' | 'a2ui';
}

export interface SliderWithInputProps extends Omit<
  SliderProps,
  'classNames' | 'label' | 'styles' | 'unit' | 'variant'
> {
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
