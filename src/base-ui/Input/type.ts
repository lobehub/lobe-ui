import type { Input as BaseInput } from '@base-ui/react/input';
import type { NumberField } from '@base-ui/react/number-field';
import type { OTPField } from '@base-ui/react/otp-field';
import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

export type InputVariant = 'filled' | 'outlined' | 'borderless';
export type InputSize = 'small' | 'middle' | 'large';

export interface InputClassNames {
  input?: string;
  prefix?: string;
  suffix?: string;
}

export interface InputStyles {
  input?: CSSProperties;
  prefix?: CSSProperties;
  suffix?: CSSProperties;
}

type BaseInputProps = Omit<
  ComponentProps<typeof BaseInput>,
  'size' | 'prefix' | 'render' | 'className' | 'style'
>;

export interface InputProps extends BaseInputProps {
  className?: string;
  /**
   * Custom class names for each part
   */
  classNames?: InputClassNames;
  /**
   * Prefix node rendered before the input
   */
  prefix?: ReactNode;
  /**
   * Reference to the input element
   */
  ref?: Ref<HTMLInputElement>;
  /**
   * Apply lobe shadow style
   */
  shadow?: boolean;
  /**
   * Size of the input
   * @default 'middle'
   */
  size?: InputSize;
  style?: CSSProperties;
  /**
   * Custom styles for each part
   */
  styles?: InputStyles;
  /**
   * Suffix node rendered after the input
   */
  suffix?: ReactNode;
  /**
   * Visual variant, defaults to `filled` in dark mode and `outlined` in light mode
   */
  variant?: InputVariant;
}

export interface InputPasswordProps extends Omit<InputProps, 'type'> {
  /**
   * Show the eye toggle button
   * @default true
   */
  visibilityToggle?: boolean;
}

type BaseNumberFieldProps = Omit<
  ComponentProps<typeof NumberField.Root>,
  'className' | 'style' | 'render' | 'onValueChange' | 'children'
>;

export interface InputNumberProps extends BaseNumberFieldProps {
  /**
   * Change value on wheel scrub
   */
  changeOnWheel?: boolean;
  className?: string;
  classNames?: Pick<InputClassNames, 'input'>;
  /**
   * Show increment/decrement buttons
   * @default true
   */
  controls?: boolean;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  ref?: Ref<HTMLInputElement>;
  shadow?: boolean;
  size?: InputSize;
  style?: CSSProperties;
  styles?: Pick<InputStyles, 'input'>;
  variant?: InputVariant;
}

type BaseOTPFieldProps = Omit<
  ComponentProps<typeof OTPField.Root>,
  'className' | 'style' | 'render' | 'onValueChange' | 'children' | 'length'
>;

export interface InputOTPProps extends BaseOTPFieldProps {
  className?: string;
  classNames?: Pick<InputClassNames, 'input'>;
  /**
   * Number of cells
   * @default 6
   */
  length?: number;
  onChange?: (value: string) => void;
  shadow?: boolean;
  size?: InputSize;
  style?: CSSProperties;
  styles?: Pick<InputStyles, 'input'>;
  variant?: InputVariant;
}

export type TextAreaAutoSize = boolean | { maxRows?: number; minRows?: number };

export interface TextAreaProps
  extends Omit<ComponentProps<'textarea'>, 'prefix'>, Pick<InputProps, 'shadow' | 'variant'> {
  /**
   * Auto grow with content, optionally bounded by minRows/maxRows
   */
  autoSize?: TextAreaAutoSize;
  classNames?: Pick<InputClassNames, 'input'>;
  ref?: Ref<HTMLTextAreaElement>;
  /**
   * Allow manual resize
   * @default false
   */
  resize?: boolean;
  styles?: Pick<InputStyles, 'input'>;
}
