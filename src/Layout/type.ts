import type { ReactNode } from 'react';

import type { DivProps } from '@/types';

export interface LayoutProps {
  asideWidth?: number;
  children?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  headerHeight?: number;
  helmet?: ReactNode;
  sidebar?: ReactNode;
  toc?: ReactNode;
  tocWidth?: number;
}

export type LayoutFooterProps = DivProps;

export interface LayoutHeaderProps extends DivProps {
  headerHeight?: number;
}
export type LayoutMainProps = DivProps;

export interface LayoutSidebarProps extends DivProps {
  headerHeight?: number;
}

export interface LayoutSidebarInnerProps extends DivProps {
  headerHeight?: number;
}

export interface LayoutTocProps extends DivProps {
  tocWidth?: number;
}
