import { ReactNode } from 'react';

interface CommonType {
  icon?: ReactNode;
  key: string;
  label: string;
  onClick?: () => void;
}

export interface GeneralItemType extends CommonType {
  danger?: boolean;
  disabled?: boolean;
  shortcut?: ('meta' | 'control' | 'shift' | 'alt' | string)[];
}

export interface SubMenuType extends CommonType {
  children: MenuItemType[];
}

export interface MenuDividerType {
  dashed?: boolean;
  type: 'divider';
}

export type MenuItemType = GeneralItemType | SubMenuType | MenuDividerType;
