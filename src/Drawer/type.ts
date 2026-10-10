import type { CSSProperties, ReactNode } from 'react';

export type DrawerPlacement = 'bottom' | 'left' | 'right' | 'top';

export type DrawerPush = boolean | { distance?: number };

export interface DrawerSemanticNames {
  backdrop?: string;
  bodyContent?: string;
  close?: string;
  content?: string;
  extra?: string;
  footer?: string;
  header?: string;
  panel?: string;
  popup?: string;
  sidebar?: string;
  sidebarContent?: string;
  title?: string;
}

export interface DrawerSemanticStyles {
  backdrop?: CSSProperties;
  bodyContent?: CSSProperties;
  close?: CSSProperties;
  content?: CSSProperties;
  extra?: CSSProperties;
  footer?: CSSProperties;
  header?: CSSProperties;
  panel?: CSSProperties;
  popup?: CSSProperties;
  sidebar?: CSSProperties;
  sidebarContent?: CSSProperties;
  title?: CSSProperties;
}

export interface DrawerProps {
  afterOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
  classNames?: DrawerSemanticNames;
  closable?: boolean;
  closeIcon?: ReactNode;
  containerMaxWidth?: number | string;
  extra?: ReactNode;
  footer?: ReactNode;
  getContainer?: HTMLElement | false | null;
  height?: number | string;
  keyboard?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  noHeader?: boolean;
  onClose?: () => void;
  open?: boolean;
  placement?: DrawerPlacement;
  push?: DrawerPush;
  sidebar?: ReactNode;
  sidebarWidth?: number | string;
  style?: CSSProperties;
  styles?: DrawerSemanticStyles;
  title?: ReactNode;
  width?: number | string;
  zIndex?: number;
}
