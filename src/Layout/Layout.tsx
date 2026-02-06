'use client';

import { useResponsive } from 'antd-style';
import { memo, useEffect, useMemo, useState } from 'react';

import DraggablePanel from '@/DraggablePanel';

import LayoutFooter from './components/LayoutFooter';
import LayoutHeader from './components/LayoutHeader';
import LayoutMain from './components/LayoutMain';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutSidebarInner from './components/LayoutSidebarInner';
import LayoutToc from './components/LayoutToc';
import { styles } from './style';
import type { LayoutProps } from './type';

const Layout = memo<LayoutProps>(
  ({ helmet, headerHeight = 64, header, footer, sidebar, asideWidth, toc, children, tocWidth }) => {
    // Convert headerHeight prop to CSS variable
    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--layout-header-height': `${headerHeight}px`,
      }),
      [headerHeight],
    );
    const { mobile, laptop } = useResponsive();
    const [expand, setExpand] = useState(true);
    useEffect(() => {
      setExpand(Boolean(laptop));
    }, [laptop]);

    return (
      <div style={cssVariables}>
        {helmet}
        {header && (
          <LayoutHeader headerHeight={headerHeight}>
            {header}
            {mobile && toc && <LayoutToc>{toc}</LayoutToc>}
          </LayoutHeader>
        )}
        <LayoutMain>
          {!mobile && !sidebar && <nav style={{ width: tocWidth }} />}
          {!mobile && sidebar && (
            <LayoutSidebar headerHeight={headerHeight}>
              <DraggablePanel
                expand={expand}
                maxWidth={asideWidth}
                placement="left"
                onExpandChange={setExpand}
              >
                <LayoutSidebarInner headerHeight={headerHeight}>{sidebar}</LayoutSidebarInner>
              </DraggablePanel>
            </LayoutSidebar>
          )}
          <section className={styles.content}>{children}</section>
          {!mobile && toc && <LayoutToc tocWidth={tocWidth}>{toc}</LayoutToc>}
        </LayoutMain>
        {footer && <LayoutFooter>{footer}</LayoutFooter>}
      </div>
    );
  },
);

export default Layout;
