import type { ComponentProps, ReactNode, Ref } from 'react';

export interface RateProps extends Omit<
  ComponentProps<'div'>,
  'children' | 'defaultValue' | 'onChange'
> {
  allowHalf?: boolean;
  character?: ReactNode;
  color?: string;
  count?: number;
  defaultValue?: number;
  disabled?: boolean;
  gap?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  ref?: Ref<HTMLDivElement>;
  size?: number;
  value?: number;
}
