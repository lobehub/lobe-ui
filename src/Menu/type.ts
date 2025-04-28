import type { MenuProps as AntdMenuProps, MenuRef } from 'antd';
import type {
  MenuDividerType as RcMenuDividerType,
  MenuItemGroupType as RcMenuItemGroupType,
  MenuItemType as RcMenuItemType,
  SubMenuType as RcSubMenuType,
} from 'rc-menu/es/interface';
import type { Key, Ref } from 'react';

import type { IconContentConfig, IconProps } from '@/Icon';

export interface MenuItemType extends RcMenuItemType {
  danger?: boolean;
  icon?: IconProps['icon'];
  title?: string;
}
export interface SubMenuType<T extends MenuItemType = MenuItemType>
  extends Omit<RcSubMenuType, 'children'> {
  children: ItemType<T>[];
  icon?: IconProps['icon'];
}
export interface MenuItemGroupType<T extends MenuItemType = MenuItemType>
  extends Omit<RcMenuItemGroupType, 'children'> {
  children?: ItemType<T>[];
  key?: Key;
}
export interface MenuDividerType extends RcMenuDividerType {
  dashed?: boolean;
  key?: Key;
}
export type ItemType<T extends MenuItemType = MenuItemType> =
  | T
  | SubMenuType<T>
  | MenuItemGroupType<T>
  | MenuDividerType
  | null;

export type GenericItemType<T = unknown> = T extends infer U extends MenuItemType
  ? unknown extends U
    ? ItemType
    : ItemType<U>
  : ItemType;

export interface MenuProps<T = unknown> extends Omit<AntdMenuProps, 'items'> {
  compact?: boolean;
  iconProps?: IconContentConfig;
  items: GenericItemType<T>[];
  ref?: Ref<MenuRef>;
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}

export type { MenuInfo } from 'rc-menu/es/interface';
