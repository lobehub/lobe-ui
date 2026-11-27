import type { CSSProperties, ReactNode, Ref } from 'react';

export interface ButtonGroupOption {
  disabled?: boolean;
  /** Button text; defaults to `value`. */
  label?: ReactNode;
  value: string;
}

export interface ButtonGroupClassNames {
  group?: string;
  item?: string;
  label?: string;
  root?: string;
}

export interface ButtonGroupStyles {
  group?: CSSProperties;
  item?: CSSProperties;
  label?: CSSProperties;
  root?: CSSProperties;
}

export type ButtonGroupVariant = 'default' | 'a2ui';

export interface ButtonGroupProps {
  className?: string;
  classNames?: ButtonGroupClassNames;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  disabled?: boolean;
  /** Field label above the buttons. */
  label?: ReactNode;
  /** Called with the picked value. Picking the current value again does nothing. */
  onChange?: (value: string) => void;
  /** The choices. A string is both the value and the label. */
  options: (string | ButtonGroupOption)[];
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  styles?: ButtonGroupStyles;
  /** Picked value (controlled). */
  value?: string;
  /**
   * `default`: lobe-ui buttons in a filled track (theme radius and type).
   * `a2ui`: the A2UI playground button group: 28px buttons with 12.5px type in a hairline box,
   * the picked one raised on the surface colour.
   * @default 'default'
   */
  variant?: ButtonGroupVariant;
}
