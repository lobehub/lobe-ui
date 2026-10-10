import type { ComponentProps, CSSProperties, Key, MouseEvent, ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface ListClickInfo {
  domEvent: MouseEvent<HTMLElement>;
  item: ListItemType;
  key: Key;
}

export interface ListItemType {
  actions?: ReactNode;
  avatar?: ReactNode;
  className?: string;
  danger?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  href?: string;
  icon?: IconProps['icon'];
  key: Key;
  label: ReactNode;
  onClick?: (info: ListClickInfo) => void;
  showAction?: boolean;
  style?: CSSProperties;
  type?: undefined;
}

export interface ListDividerType {
  key?: Key;
  type: 'divider';
}

export type ListItem = ListItemType | ListDividerType;

export type ListSemanticName = 'actions' | 'description' | 'extra' | 'item' | 'label';

export interface ListProps extends Omit<ComponentProps<'ul'>, 'onClick'> {
  activeKey?: Key | null;
  classNames?: Partial<Record<ListSemanticName, string>>;
  compact?: boolean;
  defaultActiveKey?: Key;
  items: ListItem[];
  onActiveChange?: (key: Key) => void;
  onClick?: (info: ListClickInfo) => void;
  ref?: Ref<HTMLUListElement>;
  selectable?: boolean;
  styles?: Partial<Record<ListSemanticName, CSSProperties>>;
  variant?: 'borderless' | 'filled' | 'outlined';
}
