'use client';

import { useResponsive } from 'antd-style';
import { memo, useEffect, useState } from 'react';

import DraggablePanel from '@/DraggablePanel';

import LayoutFooter from './components/LayoutFooter';
import LayoutHeader from './components/LayoutHeader';
import LayoutMain from './components/LayoutMain';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutSidebarInner from './components/LayoutSidebarInner';
import LayoutToc from './components/LayoutToc';
import { useStyles } from './style';
import type { LayoutProps } from './type';

const Layout = memo<LayoutProps>(
  ({ helmet, headerHeight = 64, header, footer, sidebar, asideWidth, toc, children, tocWidth }) => {
    const { styles } = useStyles(headerHeight);
    const { mobile, laptop } = useResponsive();
    const [expand, setExpand] = useState(true);
    useEffect(() => {
      setExpand(Boolean(laptop));
    }, [laptop]);

    return (
      <>
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
                onExpandChange={setExpand}
                placement="left"
              >
                <LayoutSidebarInner headerHeight={headerHeight}>{sidebar}</LayoutSidebarInner>
              </DraggablePanel>
            </LayoutSidebar>
          )}
          <section className={styles.content}>{children}</section>
          {!mobile && toc && <LayoutToc tocWidth={tocWidth}>{toc}</LayoutToc>}
        </LayoutMain>
        {footer && <LayoutFooter>{footer}</LayoutFooter>}
      </>
    );
  },
);

export default Layout;
