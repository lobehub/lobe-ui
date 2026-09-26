import type { ComponentProps, CSSProperties, Key, ReactNode, Ref } from 'react';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StepItem {
  description?: ReactNode;
  icon?: ReactNode;
  key?: Key;
  status?: StepStatus;
  title?: ReactNode;
}

export interface StepsProps extends Omit<ComponentProps<'ol'>, 'children'> {
  classNames?: { description?: string; indicator?: string; item?: string; title?: string };
  current?: number;
  items: StepItem[];
  orientation?: 'horizontal' | 'vertical';
  ref?: Ref<HTMLOListElement>;
  styles?: {
    description?: CSSProperties;
    indicator?: CSSProperties;
    item?: CSSProperties;
    title?: CSSProperties;
  };
  variant?: 'default' | 'dot';
}
