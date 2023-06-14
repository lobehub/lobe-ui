import { useResponsive } from 'antd-style';
import { ReactNode, memo, useEffect, useState } from 'react';

import { DraggablePanel } from '@/index';

import { useStyles } from './style';

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
          <header
            className={styles.header}
            style={{
              height: headerHeight,
            }}
          >
            <div className={styles.glass} />
            {header}
            {mobile && toc && <nav className={styles.toc}>{toc}</nav>}
          </header>
        )}

        <main className={styles.main}>
          {!mobile && !sidebar && <nav style={{ width: tocWidth }} />}
          {!mobile && sidebar && (
            <aside className={styles.aside} style={{ top: headerHeight }}>
              <DraggablePanel
                expand={expand}
                maxWidth={asideWidth}
                onExpandChange={setExpand}
                placement="left"
              >
                <div className={styles.asideInner}>{sidebar}</div>
              </DraggablePanel>
            </aside>
          )}
          <section className={styles.content}>{children}</section>
          {!mobile && toc && (
            <nav className={styles.toc} style={{ width: tocWidth }}>
              {toc}
            </nav>
          )}
        </main>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </>
    );
  },
);

export default Layout;
