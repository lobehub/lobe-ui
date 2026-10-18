'use client';

import clsx from 'clsx';
import { type CSSProperties, memo, useEffect, useMemo, useState } from 'react';

import { DraggablePanel } from '@/DraggablePanel';
import { styleProps } from '@/styles/stylex/props';
import { useResponsive } from '@/styles/theme/scope';

import LayoutFooter from './components/LayoutFooter';
import LayoutHeader from './components/LayoutHeader';
import LayoutMain from './components/LayoutMain';
import LayoutSidebar from './components/LayoutSidebar';
import LayoutSidebarInner from './components/LayoutSidebarInner';
import LayoutToc from './components/LayoutToc';
import { layoutClasses } from './stable';
import { styles } from './style';
import type { LayoutProps } from './type';

const Layout = memo<LayoutProps>(
  ({
    helmet,
    headerHeight,
    header,
    footer,
    sidebar,
    asideWidth,
    toc,
    children,
    tocWidth,
    className,
    style,
  }) => {
    const rootStyle = useMemo(
      () =>
        headerHeight === undefined
          ? style
          : ({ '--layout-header-height': `${headerHeight}px`, ...style } as CSSProperties),
      [headerHeight, style],
    );
    const { mobile, laptop } = useResponsive();
    const [expand, setExpand] = useState(true);
    useEffect(() => {
      setExpand(Boolean(laptop));
    }, [laptop]);

    return (
      <div className={clsx(layoutClasses(), className)} style={rootStyle}>
        {helmet}
        {header && (
          <LayoutHeader
            className={styleProps(styles.headerDefault).className}
            headerHeight={headerHeight}
          >
            {header}
            {mobile && toc && <LayoutToc>{toc}</LayoutToc>}
          </LayoutHeader>
        )}
        <LayoutMain>
          {!mobile && !sidebar && <nav style={{ width: tocWidth }} />}
          {!mobile && sidebar && (
            <LayoutSidebar headerHeight={headerHeight ?? 64}>
              <DraggablePanel
                expand={expand}
                maxWidth={asideWidth}
                placement="left"
                onExpandChange={setExpand}
              >
                <LayoutSidebarInner>{sidebar}</LayoutSidebarInner>
              </DraggablePanel>
            </LayoutSidebar>
          )}
          <section {...styleProps(styles.content, layoutClasses('content'))}>{children}</section>
          {!mobile && toc && <LayoutToc tocWidth={tocWidth}>{toc}</LayoutToc>}
        </LayoutMain>
        {footer && <LayoutFooter>{footer}</LayoutFooter>}
      </div>
    );
  },
);

export default Layout;
