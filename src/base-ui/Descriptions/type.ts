import type { ComponentProps, CSSProperties, Key, ReactNode, Ref } from 'react';

export interface DescriptionsItem {
  children?: ReactNode;
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
}
