import { useResponsive } from 'antd-style';
import { ReactNode, memo, useEffect, useState } from 'react';

import DraggablePanel from '@/DraggablePanel';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface LayoutHeaderProps extends DivProps {
  headerHeight?: number;
}
export const LayoutHeader = memo<LayoutHeaderProps>(
  ({ headerHeight, children, className, style, ...props }) => {
    const { cx, styles } = useStyles(headerHeight);
    return (
      <header
        className={cx(styles.header, className)}
        style={{
          height: headerHeight,
          ...style,
        }}
        {...props}
      >
        <div className={styles.glass} />
        {children}
      </header>
    );
  },
);

export type LayoutMainProps = DivProps;
export const LayoutMain = memo<LayoutMainProps>(({ children, className, ...props }) => {
  const { cx, styles } = useStyles();
  return (
    <main className={cx(styles.main, className)} {...props}>
      {children}
    </main>
  );
});

export interface LayoutSidebarProps extends DivProps {
  headerHeight?: number;
}
export const LayoutSidebar = memo<LayoutSidebarProps>(
  ({ headerHeight, children, className, style, ...props }) => {
    const { cx, styles } = useStyles(headerHeight);
    return (
      <aside
        className={cx(styles.aside, className)}
        style={{ top: headerHeight, ...style }}
        {...props}
      >
        {children}
      </aside>
    );
  },
);

export interface LayoutSidebarInnerProps extends DivProps {
  headerHeight?: number;
}
export const LayoutSidebarInner = memo<LayoutSidebarInnerProps>(
  ({ headerHeight, children, className, ...props }) => {
    const { cx, styles } = useStyles(headerHeight);
    return (
      <div className={cx(styles.asideInner, className)} {...props}>
        {children}
      </div>
    );
  },
);

export interface LayoutTocProps extends DivProps {
  tocWidth?: number;
}
export const LayoutToc = memo<LayoutTocProps>(
  ({ tocWidth, style, className, children, ...props }) => {
    const { cx, styles } = useStyles();
    return (
      <nav
        className={cx(styles.toc, className)}
        style={tocWidth ? { width: tocWidth, ...style } : style}
        {...props}
      >
        {children}
      </nav>
    );
  },
);

export type LayoutFooterProps = DivProps;
export const LayoutFooter = memo<LayoutFooterProps>(({ children, className, ...props }) => {
  const { cx, styles } = useStyles();
  return (
    <footer className={cx(styles.footer, className)} {...props}>
      {children}
    </footer>
  );
});

export interface LayoutProps {
  /**
   * @description Width of the sidebar
   */
  asideWidth?: number;
  /**
   * @description Children of the layout
   */
  children?: ReactNode;
  /**
   * @description Content of the layout
   */
  content?: ReactNode;
  /**
   * @description Footer of the layout
   */
  footer?: ReactNode;
  /**
   * @description Header of the layout
   */
  header?: ReactNode;
  /**
   * @description Height of the header
   * @default 64
   */
  headerHeight?: number;
  /**
   * @description Helmet of the layout
   */
  helmet?: ReactNode;
  /**
   * @description Sidebar of the layout
   */
  sidebar?: ReactNode;
  /**
   * @description Table of contents of the layout
   */
  toc?: ReactNode;
  /**
   * @description Width of the table of contents
   */
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
