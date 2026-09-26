import type { ComponentProps, ReactNode, Ref } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends Omit<ComponentProps<'div'>, 'children'> {
  children?: ReactNode;
  dashed?: boolean;
  orientation?: DividerOrientation;
  ref?: Ref<HTMLDivElement>;
}
