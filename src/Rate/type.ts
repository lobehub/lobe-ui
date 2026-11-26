import type { ComponentProps, ReactNode, Ref } from 'react';

export interface RateProps extends Omit<
  ComponentProps<'div'>,
  'children' | 'defaultValue' | 'onChange'
> {
  allowHalf?: boolean;
  character?: ReactNode;
  color?: string;
  /** Number of stars. @default 5 */
  count?: number;
  defaultValue?: number;
  disabled?: boolean;
  gap?: number;
  /** Caption above the stars (`variant="a2ui"`). */
  label?: ReactNode;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  ref?: Ref<HTMLDivElement>;
  /** Number of reviews shown after the value, as "1,284 reviews" (`variant="a2ui"`). */
  reviewCount?: number;
  size?: number;
  value?: number;
  /**
   * `a2ui`: the A2UI playground rating, a read-only display of 16px stars, the value to one
   * decimal and an optional `reviewCount`, under an optional `label`.
   * @default 'default'
   */
  variant?: 'default' | 'a2ui';
}
