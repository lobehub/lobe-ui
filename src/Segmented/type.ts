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

/** Semantic DOM class names. */
export interface SegmentedClassNames {
  /** Sliding active-item background. */
  indicator?: string;
  /** Each option button (set `height` / `padding` here for a compact control). */
  item?: string;
  itemIcon?: string;
  itemLabel?: string;
  /** Alias of `root`: the toggle group that holds the items. */
  list?: string;
  root?: string;
}

/** Semantic DOM inline styles, same parts as `SegmentedClassNames`. */
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
  /** Semantic DOM class names: `root` / `indicator` / `item` / `itemIcon` / `itemLabel`. */
  classNames?: SegmentedClassNames;
  defaultValue?: Value;
  disabled?: boolean;
  glass?: boolean;
  id?: string;
  /** Field label above the control, in the A2UI standard field look (`variant="a2ui"` only). */
  label?: ReactNode;
  name?: string;
  onChange?: (value: Value) => void;
  options?: SegmentedOptions<Value>;
  ref?: Ref<HTMLDivElement>;
  shadow?: boolean;
  size?: SegmentedSize;
  style?: CSSProperties;
  /** Semantic DOM inline styles, same parts as `classNames`. */
  styles?: SegmentedStyles;
  value?: Value;
  /**
   * `filled` or `outlined` track with a sliding indicator. `a2ui`: the A2UI standard
   * `SegmentedControl`, a pill well of 32px segments in the surrounding font size where the chosen
   * one is a raised surface, under an optional `label`; `size`, `glass`, `shadow` and `vertical`
   * do not apply.
   * @default 'filled'
   */
  variant?: SegmentedVariant | 'a2ui';
  vertical?: boolean;
}
