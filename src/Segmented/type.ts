import { type ToggleGroup as BaseUIToggleGroup } from '@base-ui/react/toggle-group';
import { type ComponentProps, type CSSProperties, type ReactNode, type Ref } from 'react';

export type SegmentedSize = 'large' | 'middle' | 'small';
export type SegmentedVariant = 'filled' | 'outlined';
export type SegmentedOrientation = 'horizontal' | 'vertical';

export interface SegmentedOption<Value extends string = string> {
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  title?: string;
  value: Value;
}

export type SegmentedOptions<Value extends string = string> = Array<SegmentedOption<Value> | Value>;

export interface SegmentedClassNames {
  indicator?: string;
  item?: string;
  itemIcon?: string;
  itemLabel?: string;
  list?: string;
  root?: string;
}

export interface SegmentedStyles {
  indicator?: CSSProperties;
  item?: CSSProperties;
  itemIcon?: CSSProperties;
  itemLabel?: CSSProperties;
  list?: CSSProperties;
  root?: CSSProperties;
}

export type SegmentedRootProps<Value extends string = string> = Omit<
  ComponentProps<typeof BaseUIToggleGroup<Value>>,
  'className' | 'render' | 'value' | 'defaultValue' | 'onValueChange' | 'multiple'
> & {
  className?: string;
};

export interface SegmentedProps<Value extends string = string> {
  block?: boolean;
  className?: string;
  classNames?: SegmentedClassNames;
  defaultValue?: Value;
  disabled?: boolean;
  glass?: boolean;
  id?: string;
  name?: string;
  onChange?: (value: Value) => void;
  options?: SegmentedOptions<Value>;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  size?: SegmentedSize;
  style?: CSSProperties;
  styles?: SegmentedStyles;
  value?: Value;
  variant?: SegmentedVariant;
  vertical?: boolean;
}
