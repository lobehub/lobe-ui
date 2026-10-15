import type {
  CSSProperties,
  Key,
  KeyboardEvent,
  MouseEvent,
  ReactInstance,
  ReactNode,
  Ref,
} from 'react';

export interface MenuInfo {
  domEvent: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
  item: ReactInstance;
  key: string;
  keyPath: string[];
}

export interface MenuTitleInfo {
  domEvent: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
  key: string;
}

export type MenuClickEventHandler = (info: MenuInfo) => void;

export type MenuHoverEventHandler = (info: {
  domEvent: MouseEvent<HTMLElement>;
  key: string;
}) => void;

export interface RenderIconInfo {
  disabled?: boolean;
  isOpen?: boolean;
  isSelected?: boolean;
  isSubMenu?: boolean;
}

export type RenderIconType = ReactNode | ((props: RenderIconInfo) => ReactNode);

interface ItemSharedProps {
  className?: string;
  ref?: Ref<HTMLLIElement | null>;
  style?: CSSProperties;
}

export interface RcSubMenuType extends ItemSharedProps {
  children: RcItemType[];
  disabled?: boolean;
  expandIcon?: RenderIconType;
  itemIcon?: RenderIconType;
  key: string;
  label?: ReactNode;
  onClick?: MenuClickEventHandler;
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;
  onTitleMouseEnter?: MenuHoverEventHandler;
  onTitleMouseLeave?: MenuHoverEventHandler;
  popupClassName?: string;
  popupOffset?: number[];
  popupStyle?: CSSProperties;
  rootClassName?: string;
  type?: 'submenu';
}

export interface RcMenuItemType extends ItemSharedProps {
  disabled?: boolean;
  extra?: ReactNode;
  itemIcon?: RenderIconType;
  key: Key;
  label?: ReactNode;
  onClick?: MenuClickEventHandler;
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;
  type?: 'item';
}

export interface RcMenuItemGroupType extends ItemSharedProps {
  children?: RcItemType[];
  label?: ReactNode;
  type: 'group';
}

export interface RcMenuDividerType extends Omit<ItemSharedProps, 'ref'> {
  type: 'divider';
}

export type RcItemType =
  RcSubMenuType | RcMenuItemType | RcMenuItemGroupType | RcMenuDividerType | null;
