import type { MenuCheckboxItemType } from './checkboxItem';
import type { MenuSwitchItemType } from './switchItem';
import type { GenericItemType } from './type';

/**
 * Base item union for Base UI driven menus (DropdownMenu / ContextMenu).
 *
 * Note: This intentionally does NOT change `GenericItemType` itself,
 * because `GenericItemType` maps to rc-menu/antd Menu item types.
 */
export type BaseMenuItemType<T = unknown> =
  | GenericItemType<T>
  | MenuCheckboxItemType
  | MenuSwitchItemType;
