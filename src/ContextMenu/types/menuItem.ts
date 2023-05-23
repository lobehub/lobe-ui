import { ReactNode } from 'react';

interface CommonType {
  key: string;
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface GeneralItemType extends CommonType {
  disabled?: boolean;
  danger?: boolean;
  shortcut?: ('meta' | 'control' | 'shift' | 'alt' | string)[];
}

export interface SubMenuType extends CommonType {
  children: MenuItemType[];
}

export interface MenuDividerType {
  type: 'divider';
  dashed?: boolean;
}

export type MenuItemType = GeneralItemType | SubMenuType | MenuDividerType;
