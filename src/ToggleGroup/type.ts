import { type CSSProperties, type ReactNode, type Ref } from 'react';

export type ToggleGroupSize = 'middle' | 'small';
export type ToggleGroupVariant = 'borderless' | 'outlined';

export interface ToggleGroupClassNames {
  item?: string;
  itemIcon?: string;
  itemLabel?: string;
  root?: string;
}

export interface ToggleGroupStyles {
  item?: CSSProperties;
  itemIcon?: CSSProperties;
  itemLabel?: CSSProperties;
  root?: CSSProperties;
}

export interface ToggleGroupOption<Value extends string = string> {
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  title?: string;
  value: Value;
}

export interface ToggleGroupProps<Value extends string = string> {
  className?: string;
  classNames?: ToggleGroupClassNames;
  defaultValue?: Value;
  disabled?: boolean;
  onChange?: (value: Value) => void;
  options?: (ToggleGroupOption<Value> | Value)[];
  ref?: Ref<HTMLDivElement>;
  size?: ToggleGroupSize;
  style?: CSSProperties;
  styles?: ToggleGroupStyles;
  value?: Value;
  variant?: ToggleGroupVariant;
}
