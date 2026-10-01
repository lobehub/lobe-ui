import type { ComponentProps, MouseEvent, ReactNode, Ref } from 'react';

export interface AnchorItem {
  children?: AnchorItem[];
  href: string;
  key: string;
  title: ReactNode;
}

export interface AnchorProps extends Omit<
  ComponentProps<'nav'>,
  'children' | 'onChange' | 'onClick'
> {
  activeKey?: string | null;
  getContainer?: () => HTMLElement | Window | null | undefined;
  items: AnchorItem[];
  offset?: number;
  onChange?: (key: string | null) => void;
  onClick?: (event: MouseEvent<HTMLAnchorElement>, item: AnchorItem) => void;
  ref?: Ref<HTMLElement>;
}
