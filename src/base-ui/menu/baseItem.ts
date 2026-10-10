import type { MenuSubmenuRoot } from '@base-ui/react/menu';
import type { ComponentPropsWithRef, Key, MouseEventHandler, ReactNode } from 'react';

import type { IconProps } from '@/Icon';

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
 * Unlike rc-menu's SubMenuType, this maps to @base-ui's Menu.SubmenuRoot + Menu.SubmenuTrigger.
 */
export interface BaseSubMenuType {
  children?: BaseMenuItemType[];
  /** Hover-close delay in ms. Requires `openOnHover`. */
  closeDelay?: number;
  danger?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Hover-open delay in ms. Requires `openOnHover`. */
  delay?: number;
  desc?: ReactNode;
  disabled?: boolean;
  /** Pinned footer slot, rendered below the scrollable submenu items with a divider border. */
  footer?: ReactNode;
  /** Pinned header slot, rendered above the scrollable submenu items with a divider border. */
  header?: ReactNode;
  icon?: IconProps['icon'];
  key?: Key;
  label?: ReactNode;
  /** Click handler on the trigger. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Fired when the submenu opens or closes. */
  onOpenChange?: (open: boolean, eventDetails: MenuSubmenuRoot.ChangeEventDetails) => void;
  /** Controlled open state of the submenu. */
  open?: boolean;
  /** Open the submenu when the trigger is hovered. */
  openOnHover?: boolean;
  /**
   * Extra DOM props spread onto the trigger element.
   * Use for `ref`, `id`, `style`, `data-*`, `aria-*`, mouse/focus events, etc.
   */
  triggerProps?: ComponentPropsWithRef<'div'>;
  type?: 'submenu';
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
  // Backward-compat: rc-menu's SubMenuType is still accepted for consumers that build items with rc-menu types.
  | SubMenuType
  | BaseMenuItemGroupType
  | MenuDividerType
  | MenuCheckboxItemType
  | MenuSwitchItemType
  | null;
