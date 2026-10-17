import { type CSSProperties, type ReactNode, type Ref } from 'react';

export type ToggleGroupSize = 'middle' | 'small';
export type ToggleGroupVariant = 'borderless' | 'outlined' | 'segmented';

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

export interface ToggleGroupBaseProps<Value extends string = string> {
  className?: string;
  classNames?: ToggleGroupClassNames;
  disabled?: boolean;
  options?: (ToggleGroupOption<Value> | Value)[];
  ref?: Ref<HTMLDivElement>;
  size?: ToggleGroupSize;
  style?: CSSProperties;
  styles?: ToggleGroupStyles;
  /**
   * Visual style of the group.
   * - outlined (default) - joined group with 1px dividers
   * - borderless - detached action buttons
   * - segmented - Segmented-like container with detached pill items, pairs with multiple
   */
  variant?: ToggleGroupVariant;
}

export interface ToggleGroupSingleProps<
  Value extends string = string,
> extends ToggleGroupBaseProps<Value> {
  defaultValue?: Value;
  multiple?: false;
  onChange?: (value: Value) => void;
  value?: Value;
}

export interface ToggleGroupMultipleProps<
  Value extends string = string,
> extends ToggleGroupBaseProps<Value> {
  defaultValue?: Value[];
  multiple: true;
  onChange?: (value: Value[]) => void;
  value?: Value[];
}

export type ToggleGroupProps<Value extends string = string> =
  ToggleGroupSingleProps<Value> | ToggleGroupMultipleProps<Value>;
