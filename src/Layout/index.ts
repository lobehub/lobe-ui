import type { ReactNode } from 'react';

import LayoutParent from './Layout';
import LayoutFooter from './components/LayoutFooter';
import LayoutHeader from './components/LayoutHeader';
import LayoutMain from './components/LayoutMain';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutSidebarInner from './components/LayoutSidebarInner';
import LayoutToc from './components/LayoutToc';
import type { LayoutProps } from './type';

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
export { default as LayoutFooter } from './components/LayoutFooter';
export { default as LayoutHeader } from './components/LayoutHeader';
export { default as LayoutMain } from './components/LayoutMain';
export { default as LayoutSidebar } from './components/LayoutSidebar';
export { default as LayoutSidebarInner } from './components/LayoutSidebarInner';
export { default as LayoutToc } from './components/LayoutToc';
export type * from './type';
