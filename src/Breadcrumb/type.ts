import type { ComponentProps, CSSProperties, Key, MouseEventHandler, ReactNode, Ref } from 'react';

export interface BreadcrumbItem {
  href?: string;
  key?: Key;
  onClick?: MouseEventHandler<HTMLElement>;
  title: ReactNode;
}

export interface BreadcrumbProps extends Omit<ComponentProps<'nav'>, 'children'> {
  classNames?: { item?: string; separator?: string };
  items: BreadcrumbItem[];
  ref?: Ref<HTMLElement>;
  separator?: ReactNode;
  styles?: { item?: CSSProperties; separator?: CSSProperties };
}
