import type { Key, ReactNode } from 'react';

import type { MenuCheckboxItemType } from './checkboxItem';
import type { MenuSwitchItemType } from './switchItem';
import type { MenuDividerType, MenuItemType, SubMenuType } from './type';

/**
 * Group type for Base UI driven menus (DropdownMenu / ContextMenu).
 * Unlike MenuItemGroupType, this supports checkbox/switch items in children.
 */
export interface BaseMenuItemGroupType {
  children?: BaseMenuItemType[];
  key?: Key;
  label?: ReactNode;
  type: 'group';
}

/**
 * Submenu type for Base UI driven menus (DropdownMenu / ContextMenu).
 * Unlike SubMenuType, this supports checkbox/switch items in children.
 */
export interface BaseSubMenuType extends Omit<SubMenuType, 'children'> {
  children?: BaseMenuItemType[];
}

/**
 * Base item union for Base UI driven menus (DropdownMenu / ContextMenu).
 *
 * Note: This intentionally does NOT change `GenericItemType` itself,
 * because `GenericItemType` maps to rc-menu/antd Menu item types.
 */
export type BaseMenuItemType =
  | MenuItemType
  | BaseSubMenuType
  | BaseMenuItemGroupType
  | MenuDividerType
  | MenuCheckboxItemType
  | MenuSwitchItemType
  | null;
