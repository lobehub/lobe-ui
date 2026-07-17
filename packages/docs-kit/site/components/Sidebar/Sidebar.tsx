import { useCallback, useLayoutEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router';

import type { NavigationCategory, NavigationSection } from '../../types/content';
import { styles } from './style';

interface SidebarProps {
  navigation: NavigationSection[];
  onNavigate?: () => void;
  section?: NavigationSection;
}

const overviewLinks = [
  { pathname: '/', title: 'Overview' },
  { pathname: '/changelog', title: 'Changelog' },
] as const;

interface IndicatorGeometry {
  height: number;
  width: number;
  x: number;
  y: number;
}

const isSameGeometry = (left: IndicatorGeometry, right: IndicatorGeometry) =>
  left.height === right.height &&
  left.width === right.width &&
  left.x === right.x &&
  left.y === right.y;

const SidebarLink = ({
  end,
  onNavigate,
  pathname,
  title,
}: {
  end: boolean;
  onNavigate?: () => void;
  pathname: string;
  title: string;
}) => (
  <NavLink end={end} to={pathname} onClick={onNavigate}>
    <span className={styles.label}>{title}</span>
  </NavLink>
);

const CategoryGroup = ({
  category,
  onNavigate,
}: {
  category: NavigationCategory;
  onNavigate?: () => void;
}) => (
  <div className={styles.category}>
    <h3>{category.title}</h3>
    <ul>
      {category.documents.map((item) => (
        <li key={item.pathname}>
          <SidebarLink end pathname={item.pathname} title={item.title} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  </div>
);

export function Sidebar({ navigation, onNavigate, section }: SidebarProps) {
  const { pathname } = useLocation();
  const rootRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const geometryRef = useRef<IndicatorGeometry>(undefined);

  const measureIndicator = useCallback(() => {
    const root = rootRef.current;
    const indicator = indicatorRef.current;
    const activeLink = root?.querySelector<HTMLElement>('a[aria-current="page"]');

    if (!root || !indicator || !activeLink) {
      geometryRef.current = undefined;
      indicator?.removeAttribute('data-positioned');
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const activeRect = activeLink.getBoundingClientRect();
    const nextGeometry = {
      height: activeRect.height,
      width: activeRect.width,
      x: activeRect.left - rootRect.left,
      y: activeRect.top - rootRect.top,
    };

    if (geometryRef.current && isSameGeometry(geometryRef.current, nextGeometry)) return;

    geometryRef.current = nextGeometry;
    indicator.style.height = `${nextGeometry.height}px`;
    indicator.style.transform = `translate3d(${nextGeometry.x}px, ${nextGeometry.y}px, 0)`;
    indicator.style.width = `${nextGeometry.width}px`;
    indicator.setAttribute('data-positioned', '');

    if (!indicator.hasAttribute('data-animated')) {
      indicator.getBoundingClientRect();
      indicator.setAttribute('data-animated', '');
    }
  }, []);

  useLayoutEffect(() => {
    measureIndicator();

    const root = rootRef.current;
    const activeLink = root?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!root || !activeLink || typeof ResizeObserver === 'undefined') return;

    const resizeObserver = new ResizeObserver(measureIndicator);
    resizeObserver.observe(root);
    resizeObserver.observe(activeLink);

    return () => resizeObserver.disconnect();
  }, [measureIndicator, pathname, section]);

  return (
    <nav aria-label="Component documentation" className={styles.root} ref={rootRef}>
      <span
        aria-hidden
        className={styles.activePill}
        data-sidebar-active-indicator=""
        ref={indicatorRef}
      />
      {section ? (
        <section aria-label={section.title} className={styles.section}>
          {section.categories.map((category) => (
            <CategoryGroup category={category} key={category.title} onNavigate={onNavigate} />
          ))}
        </section>
      ) : (
        <>
          <section className={styles.section}>
            <h2>Documentation</h2>
            <ul>
              {overviewLinks.map((item) => (
                <li key={item.pathname}>
                  <SidebarLink
                    end={item.pathname === '/'}
                    pathname={item.pathname}
                    title={item.title}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </section>

          {navigation.map((navigationSection) => (
            <section className={styles.section} key={navigationSection.title}>
              <h2>{navigationSection.title}</h2>
              {navigationSection.categories.map((category) => (
                <CategoryGroup category={category} key={category.title} onNavigate={onNavigate} />
              ))}
            </section>
          ))}
        </>
      )}
    </nav>
  );
}
