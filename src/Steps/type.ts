import type { ComponentProps, CSSProperties, Key, ReactNode, Ref } from 'react';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StepItem {
  description?: ReactNode;
  icon?: ReactNode;
  key?: Key;
  status?: StepStatus;
  /** Time or date shown at the end of the title row (`variant="a2ui"`). */
  time?: ReactNode;
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
  /**
   * `a2ui`: the A2UI playground timeline, always vertical, in a card: a check on finished
   * steps, a ringed accent dot on the current one, a hollow dot on waiting ones, each item's
   * `time` at the end of its title row.
   * @default 'default'
   */
  variant?: 'default' | 'dot' | 'a2ui';
}
