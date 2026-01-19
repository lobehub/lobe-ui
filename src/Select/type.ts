import type { CSSProperties, ReactNode } from 'react';

import type { IconProps } from '@/Icon';

export type SelectSize = 'large' | 'middle' | 'small';
export type SelectVariant = 'borderless' | 'filled' | 'outlined';

export interface SelectOption<Value = string> {
  className?: string;
  disabled?: boolean;
  label: ReactNode;
  style?: CSSProperties;
  title?: string;
  value: Value;
}

export interface SelectOptionGroup<Value = string> {
  disabled?: boolean;
  label: ReactNode;
  options: SelectOption<Value>[];
}

export type SelectOptions<Value = string> = Array<SelectOption<Value> | SelectOptionGroup<Value>>;

export interface SelectClassNames {
  clear?: string;
  dropdown?: string;
  empty?: string;
  group?: string;
  groupLabel?: string;
  icon?: string;
  item?: string;
  itemIndicator?: string;
  itemText?: string;
  list?: string;
  option?: string;
  popup?: string;
  prefix?: string;
  root?: string;
  search?: string;
  suffix?: string;
  trigger?: string;
  value?: string;
}

export interface SelectProps<Value = string> {
  allowClear?: boolean;
  autoFocus?: boolean;
  className?: string;
  classNames?: SelectClassNames;
  defaultOpen?: boolean;
  defaultValue?: Value | Value[] | null;
  disabled?: boolean;
  id?: string;
  labelRender?: (option: SelectOption<Value>) => ReactNode;
  listItemHeight?: number;
  loading?: boolean;
  mode?: 'multiple' | 'tags';
  name?: string;
  onChange?: (
    value: Value | Value[] | null,
    option?: SelectOption<Value> | SelectOption<Value>[],
  ) => void;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (value: Value, option?: SelectOption<Value>) => void;
  open?: boolean;
  optionRender?: (option: SelectOption<Value>, info: { index: number }) => ReactNode;
  options?: SelectOptions<Value>;
  placeholder?: ReactNode;
  popupClassName?: string;
  popupMatchSelectWidth?: boolean | number;
  prefix?: ReactNode | IconProps['icon'];
  readOnly?: boolean;
  required?: boolean;
  shadow?: boolean;
  showSearch?: boolean;
  size?: SelectSize;
  style?: CSSProperties;
  suffixIcon?: IconProps['icon'] | ReactNode;
  suffixIconProps?: Omit<IconProps, 'icon'>;
  tokenSeparators?: string[];
  value?: Value | Value[] | null;
  variant?: SelectVariant;
  virtual?: boolean;
}
