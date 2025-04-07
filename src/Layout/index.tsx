'use client';

import { type ReactNode } from 'react';

import LayoutParent, { type LayoutProps } from './Layout';
import LayoutFooter from './components/LayoutFooter';
import LayoutHeader from './components/LayoutHeader';
import LayoutMain from './components/LayoutMain';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutSidebarInner from './components/LayoutSidebarInner';
import LayoutToc from './components/LayoutToc';

export interface ILayout {
  (props: LayoutProps): ReactNode;
  Footer: typeof LayoutFooter;
  Header: typeof LayoutHeader;
  Main: typeof LayoutMain;
  Sidebar: typeof LayoutSidebar;
  SidebarInner: typeof LayoutSidebarInner;
  Toc: typeof LayoutToc;
}

const Layout = LayoutParent as unknown as ILayout;

Layout.Footer = LayoutFooter;
Layout.Header = LayoutHeader;
Layout.Toc = LayoutToc;
Layout.Sidebar = LayoutSidebar;
Layout.SidebarInner = LayoutSidebarInner;
Layout.Main = LayoutMain;

export default Layout;
export { default as LayoutFooter, type LayoutFooterProps } from './components/LayoutFooter';
export { default as LayoutHeader, type LayoutHeaderProps } from './components/LayoutHeader';
export { default as LayoutMain, type LayoutMainProps } from './components/LayoutMain';
export { default as LayoutSidebar, type LayoutSidebarProps } from './components/LayoutSidebar';
export {
  default as LayoutSidebarInner,
  type LayoutSidebarInnerProps,
} from './components/LayoutSidebarInner';
export { default as LayoutToc, type LayoutTocProps } from './components/LayoutToc';
export type { LayoutProps } from './Layout';
