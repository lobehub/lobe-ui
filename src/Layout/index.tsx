import { useResponsive } from 'antd-style';
import { ReactNode, memo, useEffect, useState } from 'react';

import DraggablePanel from '@/DraggablePanel';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface LayoutHeaderProps extends DivProps {
  headerHeight?: number;
}
export const LayoutHeader = memo<LayoutHeaderProps>(({ headerHeight, children, ...props }) => {
  const { styles } = useStyles(headerHeight);
  return (
    <header
      className={styles.header}
      style={{
        height: headerHeight,
      }}
      {...props}
    >
      <div className={styles.glass} />
      {children}
    </header>
  );
});

export type LayoutMainProps = DivProps;
export const LayoutMain = memo<LayoutMainProps>(({ children, ...props }) => {
  const { styles } = useStyles();
  return (
    <main className={styles.main} {...props}>
      {children}
    </main>
  );
});

export interface LayoutSidebarProps extends DivProps {
  headerHeight?: number;
}
export const LayoutSidebar = memo<LayoutSidebarProps>(({ headerHeight, children, ...props }) => {
  const { styles } = useStyles(headerHeight);
  return (
    <aside className={styles.aside} style={{ top: headerHeight }} {...props}>
      {children}
    </aside>
  );
});

export interface LayoutSidebarInnerProps extends DivProps {
  headerHeight?: number;
}
export const LayoutSidebarInner = memo<LayoutSidebarInnerProps>(
  ({ headerHeight, children, ...props }) => {
    const { styles } = useStyles(headerHeight);
    return (
      <div className={styles.asideInner} {...props}>
        {children}
      </div>
    );
  },
);

export interface LayoutTocProps extends DivProps {
  tocWidth?: number;
}
export const LayoutToc = memo<LayoutTocProps>(({ tocWidth, children, ...props }) => {
  const { styles } = useStyles();
  return (
    <nav className={styles.toc} style={{ width: tocWidth }} {...props}>
      {children}
    </nav>
  );
});

export type LayoutFooterProps = DivProps;
export const LayoutFooter = memo<LayoutFooterProps>(({ children, ...props }) => {
  const { styles } = useStyles();
  return (
    <footer className={styles.footer} {...props}>
      {children}
    </footer>
  );
});

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
            {mobile && toc && <LayoutToc tocWidth={tocWidth}>{toc}</LayoutToc>}
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
