import type { Key, ReactNode } from 'react';
import { isValidElement } from 'react';

import Icon, { type IconSize } from '@/Icon';

import type { BaseMenuItemType } from './baseItem';
import type { MenuCheckboxItemType } from './checkboxItem';
import type { MenuItemType, SubMenuType } from './type';

export type IconSpaceMode = 'global' | 'group';

export type IconAlign = 'center' | 'start';

export interface RenderOptions {
  iconAlign?: IconAlign;
  iconSpaceMode?: IconSpaceMode;
  indicatorOnRight?: boolean;
  reserveIconSpace?: boolean;
}

export interface RenderItemContentOptions {
  iconAlign?: IconAlign;
  indicatorOnRight?: boolean;
  reserveIconSpace?: boolean;
  submenu?: boolean;
}

type KeyableItem = { key?: Key };

export const getItemKey = (item: KeyableItem, fallback: string): Key => {
  if (item && 'key' in item && item.key !== undefined) return item.key;
  return fallback;
};

type LabelableItem = {
  key?: Key;
  label?: ReactNode;
  title?: ReactNode;
};

export const getItemLabel = (
  item: MenuItemType | SubMenuType | MenuCheckboxItemType | LabelableItem,
): ReactNode => {
  if (item.label !== undefined) return item.label;
  if ('title' in item && item.title !== undefined) return item.title;
  return item.key;
};

export const renderIcon = (icon: MenuItemType['icon'], size?: IconSize): ReactNode => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  return <Icon icon={icon} size={size} />;
};

export const hasAnyIcon = (items: BaseMenuItemType[], recursive = false): boolean => {
  return items.some((item) => {
    if (!item) return false;
    if ((item as MenuCheckboxItemType).type === 'checkbox') return true;
    if ('icon' in item && item.icon) return true;
    if (recursive && 'children' in item && item.children) {
      return hasAnyIcon(item.children as BaseMenuItemType[], true);
    }
    return false;
  });
};

export const hasCheckboxAndIcon = (items: BaseMenuItemType[]): boolean => {
  let hasCheckbox = false;
  let hasIcon = false;
  for (const item of items) {
    if (!item) continue;
    if ((item as MenuCheckboxItemType).type === 'checkbox') {
      hasCheckbox = true;
    }
    if ('icon' in item && item.icon) {
      hasIcon = true;
    }
    if (hasCheckbox && hasIcon) return true;
  }
  return false;
};
