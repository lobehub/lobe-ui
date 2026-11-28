import type { CSSProperties, ReactNode, Ref } from 'react';

export interface ChipSelectOption {
  disabled?: boolean;
  /** Chip text; defaults to `value`. */
  label?: ReactNode;
  value: string;
}

export interface ChipSelectClassNames {
  chip?: string;
  chips?: string;
  label?: string;
  root?: string;
}

export interface ChipSelectStyles {
  chip?: CSSProperties;
  chips?: CSSProperties;
  label?: CSSProperties;
  root?: CSSProperties;
}

export interface ChipSelectTexts {
  /** The counter next to the label; `{count}` is replaced by the number of picked chips. */
  selected?: string;
}

export type ChipSelectVariant = 'default' | 'a2ui';

export interface ChipSelectProps {
  className?: string;
  classNames?: ChipSelectClassNames;
  /** Initial picked values (uncontrolled). */
  defaultValue?: string[];
  disabled?: boolean;
  /** Field label above the chips. */
  label?: ReactNode;
  onChange?: (value: string[]) => void;
  /** Chips. A string is both the value and the label. */
  options: (string | ChipSelectOption)[];
  ref?: Ref<HTMLDivElement>;
  /**
   * Show "N selected" on the right of the label row while something is picked.
   * @default true
   */
  showCount?: boolean;
  style?: CSSProperties;
  styles?: ChipSelectStyles;
  /** Overrides the built-in `chipSelect.*` texts. */
  texts?: ChipSelectTexts;
  /** Picked values (controlled). */
  value?: string[];
  /**
   * `default`: lobe-ui chips (theme radius, body type, filled when picked).
   * `a2ui`: the A2UI playground chips: 28px pills, 12.5px type, an accent wash and a check mark
   * when picked.
   * @default 'default'
   */
  variant?: ChipSelectVariant;
}
