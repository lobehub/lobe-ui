import type { CSSProperties, ReactNode } from 'react';

import type { IconProps } from '@/Icon';

export type LobeSelectSize = 'large' | 'middle' | 'small';
export type LobeSelectVariant = 'borderless' | 'filled' | 'outlined';

export interface LobeSelectOption<Value = string> {
  className?: string;
  disabled?: boolean;
  label: ReactNode;
  style?: CSSProperties;
  title?: string;
  value: Value;
}

export interface LobeSelectOptionGroup<Value = string> {
  disabled?: boolean;
  label: ReactNode;
  options: LobeSelectOption<Value>[];
}

export type LobeSelectOptions<Value = string> = Array<
  LobeSelectOption<Value> | LobeSelectOptionGroup<Value>
>;

export interface LobeSelectClassNames {
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

export interface LobeSelectProps<Value = string> {
  allowClear?: boolean;
  autoFocus?: boolean;
  className?: string;
  classNames?: LobeSelectClassNames;
  defaultOpen?: boolean;
  defaultValue?: Value | Value[] | null;
  disabled?: boolean;
  id?: string;
  labelRender?: (option: LobeSelectOption<Value>) => ReactNode;
  listItemHeight?: number;
  loading?: boolean;
  mode?: 'multiple' | 'tags';
  name?: string;
  onChange?: (
    value: Value | Value[] | null,
    option?: LobeSelectOption<Value> | LobeSelectOption<Value>[],
  ) => void;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (value: Value, option?: LobeSelectOption<Value>) => void;
  open?: boolean;
  optionRender?: (option: LobeSelectOption<Value>, info: { index: number }) => ReactNode;
  options?: LobeSelectOptions<Value>;
  placeholder?: ReactNode;
  popupClassName?: string;
  popupMatchSelectWidth?: boolean | number;
  prefix?: ReactNode | IconProps['icon'];
  readOnly?: boolean;
  required?: boolean;
  shadow?: boolean;
  showSearch?: boolean;
  size?: LobeSelectSize;
  style?: CSSProperties;
  suffixIcon?: IconProps['icon'] | ReactNode;
  suffixIconProps?: Omit<IconProps, 'icon'>;
  tokenSeparators?: string[];
  value?: Value | Value[] | null;
  variant?: LobeSelectVariant;
  virtual?: boolean;
}
