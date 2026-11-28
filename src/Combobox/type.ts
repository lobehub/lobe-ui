import type { CSSProperties, ReactNode, Ref } from 'react';

export interface ComboboxOption {
  disabled?: boolean;
  /** Extra text the search matches, e.g. a country code. */
  keywords?: string;
  /** Item text; defaults to `value`. A string label is also what the search matches. */
  label?: ReactNode;
  value: string;
}

export interface ComboboxClassNames {
  item?: string;
  label?: string;
  popup?: string;
  root?: string;
  trigger?: string;
}

export interface ComboboxStyles {
  item?: CSSProperties;
  label?: CSSProperties;
  popup?: CSSProperties;
  root?: CSSProperties;
  trigger?: CSSProperties;
}

export interface ComboboxTexts {
  /** Shown when nothing matches the search. */
  empty?: string;
  /** Trigger text without a value. */
  placeholder?: string;
  /** Placeholder of the search field. */
  search?: string;
}

export type ComboboxVariant = 'default' | 'a2ui';

export interface ComboboxProps {
  className?: string;
  classNames?: ComboboxClassNames;
  defaultOpen?: boolean;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  disabled?: boolean;
  /** Id of the trigger button; the label points at it. */
  id?: string;
  /** Field label above the trigger. */
  label?: ReactNode;
  /** Called with the picked value and its option. */
  onChange?: (value: string, option: ComboboxOption) => void;
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state of the list. */
  open?: boolean;
  /** The choices. A string is both the value and the label. */
  options: (string | ComboboxOption)[];
  /** Trigger text without a value; defaults to the `combobox.placeholder` text. */
  placeholder?: string;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  styles?: ComboboxStyles;
  /** Overrides the built-in `combobox.*` texts. */
  texts?: ComboboxTexts;
  /** Picked value (controlled). */
  value?: string;
  /**
   * `default`: a lobe-ui select-like trigger and popup list.
   * `a2ui`: the A2UI playground combobox: a 34px outline trigger with an up-down chevron and a
   * command list (search field, 13px items, a check on the picked one) in a 10px popover.
   * @default 'default'
   */
  variant?: ComboboxVariant;
}
