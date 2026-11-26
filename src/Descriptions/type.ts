import type { ComponentProps, CSSProperties, Key, ReactNode, Ref } from 'react';

export interface DescriptionsItem {
  children?: ReactNode;
  /** Muted line under the value (`variant="a2ui"`), e.g. a time zone or "Incl. tax". */
  hint?: ReactNode;
  key?: Key;
  label?: ReactNode;
  span?: number;
}

export interface DescriptionsProps extends Omit<ComponentProps<'div'>, 'title'> {
  bordered?: boolean;
  classNames?: { content?: string; label?: string };
  colon?: boolean;
  column?: number;
  extra?: ReactNode;
  items: DescriptionsItem[];
  ref?: Ref<HTMLDivElement>;
  styles?: { content?: CSSProperties; label?: CSSProperties };
  title?: ReactNode;
  /**
   * `a2ui`: the A2UI playground key-value list, a card of label / value rows split by dashed
   * hairlines; `column` (1-3) lays rows out in columns on wide containers. `bordered` and
   * `colon` do not apply.
   * @default 'default'
   */
  variant?: 'default' | 'a2ui';
}
