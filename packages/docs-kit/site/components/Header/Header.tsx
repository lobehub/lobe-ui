import { type DropdownItem, DropdownMenu, Hotkey, ScrollArea } from '@lobehub/ui';
import { LobeHubText } from '@lobehub/ui/brand';
import { GithubIcon } from '@lobehub/ui/icons';
import { Ellipsis, Menu, Search, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { findSectionByPathname, sectionLandingPathname } from '../../content/pageChrome';
import type { NavigationSection } from '../../types/content';
import { Sidebar } from '../Sidebar/Sidebar';
import { buildNavModel, computeCollapsedCount } from './navOverflow';
import { styles } from './style';
import { ThemeMenu } from './ThemeMenu';

interface HeaderProps {
  navigation: NavigationSection[];
  onSearchOpen: (trigger: HTMLButtonElement) => void;
}

const LOGO_URL =
  'https://registry.npmmirror.com/@lobehub/assets-logo/1.2.0/files/assets/logo-3d.webp';

// LobeHubText viewBox keeps ~49% vertical padding, so the wordmark box must
// be larger than the 3d logo for letter ink to optically match the icon.
const LOGO_SIZE = 20;

interface IndicatorGeometry {
  width: number;
  x: number;
}

const isSameGeometry = (left: IndicatorGeometry, right: IndicatorGeometry) =>
  left.width === right.width && left.x === right.x;

const SHEET_EXIT_DURATION = 180;

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

export function Header({ navigation, onSearchOpen }: HeaderProps) {
  const [sheetState, setSheetState] = useState<'closed' | 'closing' | 'open'>('closed');
  const [atTop, setAtTop] = useState(true);
  const [isAppleShortcut, setIsAppleShortcut] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const indicatorGeometryRef = useRef<IndicatorGeometry>(undefined);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeSection = findSectionByPathname(navigation, pathname);
  const navItems = siteConfig.themeConfig?.navItems ?? [];
  const navModel = buildNavModel(navigation, navItems);
  const { collapsibleKeys, externalNavItems, hasChangelogNavItem, orderedSections } = navModel;

  const [collapsedCount, setCollapsedCount] = useState(navModel.defaultCollapsedCount);
  const collapsed = Math.min(collapsedCount, collapsibleKeys.length);
  const collapsedKeys = new Set(collapsibleKeys.slice(collapsibleKeys.length - collapsed));

  const measureOverflow = useCallback(() => {
    const nav = navRef.current;
    const rail = railRef.current;
    if (!nav || !rail) return;

    const available = nav.clientWidth;
    if (available <= 0) return;

    const widths = new Map<string, number>();
    for (const item of rail.querySelectorAll<HTMLElement>('[data-measure]')) {
      widths.set(item.dataset.measure ?? '', item.offsetWidth);
    }
    const measured = (key: string) => widths.get(key) ?? 0;

    const model = buildNavModel(navigation, siteConfig.themeConfig?.navItems ?? []);
    setCollapsedCount(
      computeCollapsedCount({
        available,
        candidateWidths: model.collapsibleKeys.map(measured),
        fixedWidths: model.fixedKeys.map(measured),
        gap: Number.parseFloat(getComputedStyle(nav).columnGap) || 0,
        moreWidth: measured('more'),
      }),
    );
  }, [navigation]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const rail = railRef.current;
    if (!nav || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(nav);
    if (rail) observer.observe(rail);
    return () => observer.disconnect();
  }, [measureOverflow]);

  const openNavigation = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    setSheetState('open');
  }, []);

  const closeNavigation = useCallback(() => {
    if (sheetState === 'closed') return;
    window.clearTimeout(closeTimerRef.current);

    if (prefersReducedMotion()) {
      setSheetState('closed');
      menuButtonRef.current?.focus();
      return;
    }

    setSheetState('closing');
    closeTimerRef.current = window.setTimeout(() => {
      setSheetState('closed');
      menuButtonRef.current?.focus();
    }, SHEET_EXIT_DURATION);
  }, [sheetState]);

  useEffect(() => {
    if (sheetState !== 'open') return;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeNavigation();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeNavigation, sheetState]);

  useEffect(
    () => () => {
      window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY < 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    setIsAppleShortcut(/mac|iphone|ipod|ipad|ios/i.test(navigator.userAgent));
  }, []);

  const handleSheetKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isHome = pathname === '/';
  const actions = siteConfig.themeConfig?.actions ?? [];
  const githubSocialLink = siteConfig.themeConfig?.socialLinks?.find(
    (link) => link.icon === 'github',
  );
  const productName = siteConfig.title.replace(/^Lobe(?:Hub)?\s+/i, '') || siteConfig.title;
  const showThemeMenu = (siteConfig.themeConfig?.prefersColor ?? 'auto') === 'auto';

  const inlineSections = orderedSections.filter(
    (section) => !collapsedKeys.has(`section:${section.title}`),
  );
  const collapsedSections = orderedSections.filter((section) =>
    collapsedKeys.has(`section:${section.title}`),
  );
  const collapsedExternalItems = externalNavItems.filter((item) =>
    collapsedKeys.has(`nav:${item.label}`),
  );
  const changelogCollapsed = !hasChangelogNavItem && collapsedKeys.has('changelog');
  const showInlineChangelog = !hasChangelogNavItem && !changelogCollapsed;

  const secondaryItems: DropdownItem[] = [
    ...collapsedExternalItems.map((item) => ({
      key: `nav:${item.label}`,
      label: item.label,
      onClick: () => window.open(item.href, '_blank', 'noopener,noreferrer'),
    })),
    ...(changelogCollapsed
      ? [{ key: 'changelog', label: 'Changelog', onClick: () => navigate('/changelog') }]
      : []),
  ];
  const moreItems: DropdownItem[] = [
    ...collapsedSections.map((section) => ({
      key: `section:${section.title}`,
      label: section.title,
      onClick: () => navigate(sectionLandingPathname(section)),
    })),
    ...(collapsedSections.length > 0 && secondaryItems.length > 0
      ? [{ type: 'divider' as const }]
      : []),
    ...secondaryItems,
  ];
  const isMoreActive =
    (activeSection ? collapsedKeys.has(`section:${activeSection.title}`) : false) ||
    (changelogCollapsed && pathname === '/changelog');

  const measureIndicator = useCallback(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    const activeTab = nav?.querySelector<HTMLElement>('[aria-current]');

    if (!nav || !indicator || !activeTab) {
      indicatorGeometryRef.current = undefined;
      indicator?.removeAttribute('data-positioned');
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const activeRect = activeTab.getBoundingClientRect();
    const nextGeometry = {
      width: activeRect.width,
      x: activeRect.left - navRect.left,
    };

    if (indicatorGeometryRef.current && isSameGeometry(indicatorGeometryRef.current, nextGeometry))
      return;

    indicatorGeometryRef.current = nextGeometry;
    indicator.style.transform = `translate3d(${nextGeometry.x}px, 0, 0)`;
    indicator.style.width = `${nextGeometry.width}px`;
    indicator.setAttribute('data-positioned', '');

    if (!indicator.hasAttribute('data-animated')) {
      indicator.getBoundingClientRect();
      indicator.setAttribute('data-animated', '');
    }
  }, []);

  useLayoutEffect(() => {
    measureIndicator();

    const nav = navRef.current;
    const activeTab = nav?.querySelector<HTMLElement>('[aria-current]');
    if (!nav || !activeTab || typeof ResizeObserver === 'undefined') return;

    const resizeObserver = new ResizeObserver(measureIndicator);
    resizeObserver.observe(nav);
    resizeObserver.observe(activeTab);

    return () => resizeObserver.disconnect();
  }, [collapsed, measureIndicator, navigation, pathname]);

  return (
    <>
      <header className={styles.root} data-transparent={atTop ? '' : undefined}>
        <div className={styles.inner}>
          <button
            aria-controls="mobile-documentation-navigation"
            aria-expanded={sheetState !== 'closed'}
            aria-label="Open documentation navigation"
            className={`${styles.iconButton} ${styles.menuButton}`}
            ref={menuButtonRef}
            type="button"
            onClick={openNavigation}
          >
            <Menu aria-hidden size={18} strokeWidth={1.8} />
          </button>

          <Link
            aria-label={`${siteConfig.title} documentation home`}
            className={styles.brand}
            to="/"
          >
            <img
              aria-hidden
              alt=""
              className={styles.logo}
              height={LOGO_SIZE}
              src={LOGO_URL}
              width={LOGO_SIZE}
            />
            <LobeHubText aria-hidden className={styles.wordmark} />
            <span aria-hidden className={styles.brandDivider}>
              /
            </span>
            <span className={styles.productName}>{productName}</span>
          </Link>

          <nav aria-label="Documentation sections" className={styles.nav} ref={navRef}>
            <span
              aria-hidden
              className={styles.navIndicator}
              data-header-nav-indicator=""
              ref={indicatorRef}
            />
            <Link aria-current={isHome ? 'page' : undefined} className={styles.navLink} to="/">
              Home
            </Link>
            {inlineSections.map((section) => (
              <Link
                aria-current={section === activeSection ? 'true' : undefined}
                className={styles.navLink}
                key={section.title}
                to={sectionLandingPathname(section)}
              >
                {section.title}
              </Link>
            ))}
            {moreItems.length > 0 ? (
              <DropdownMenu items={moreItems} placement="bottomLeft">
                <button
                  aria-current={isMoreActive ? 'true' : undefined}
                  aria-label="More navigation links"
                  className={`${styles.navLink} ${styles.moreButton}`}
                  type="button"
                >
                  <Ellipsis aria-hidden size={16} strokeWidth={1.8} />
                </button>
              </DropdownMenu>
            ) : null}
            {navItems.map((item) => {
              if (item.external) {
                if (collapsedKeys.has(`nav:${item.label}`)) return null;
                return (
                  <a
                    className={styles.navLink}
                    href={item.href}
                    key={item.label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={styles.navLink}
                  key={item.label}
                  to={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
            {showInlineChangelog ? (
              <Link
                aria-current={pathname === '/changelog' ? 'page' : undefined}
                className={styles.navLink}
                to="/changelog"
              >
                Changelog
              </Link>
            ) : null}
            <div aria-hidden className={styles.measureRail} ref={railRef}>
              <span className={styles.navLink} data-measure="home">
                Home
              </span>
              {orderedSections.map((section) => (
                <span
                  className={styles.navLink}
                  data-measure={`section:${section.title}`}
                  key={section.title}
                >
                  {section.title}
                </span>
              ))}
              {navItems.map((item) => (
                <span
                  className={styles.navLink}
                  data-measure={`nav:${item.label}`}
                  key={item.label}
                >
                  {item.label}
                </span>
              ))}
              {hasChangelogNavItem ? null : (
                <span className={styles.navLink} data-measure="changelog">
                  Changelog
                </span>
              )}
              <span className={`${styles.navLink} ${styles.moreButton}`} data-measure="more">
                <Ellipsis aria-hidden size={16} strokeWidth={1.8} />
              </span>
            </div>
          </nav>

          <div className={styles.actions}>
            <button
              aria-keyshortcuts="Meta+K Control+K"
              aria-label="Search documentation"
              className={styles.search}
              type="button"
              onClick={(event) => onSearchOpen(event.currentTarget)}
            >
              <Search aria-hidden size={15} strokeWidth={1.8} />
              <span>Search</span>
              <Hotkey
                compact
                className={styles.searchHotkey}
                isApple={isAppleShortcut}
                keys="mod+k"
              />
            </button>
            <button
              aria-keyshortcuts="Meta+K Control+K"
              aria-label="Open search"
              className={`${styles.iconButton} ${styles.mobileSearch}`}
              type="button"
              onClick={(event) => onSearchOpen(event.currentTarget)}
            >
              <Search aria-hidden size={17} strokeWidth={1.8} />
            </button>
            {actions.map((item) => (
              <a
                className={styles.navLink}
                href={item.href}
                key={item.label}
                rel={item.external ? 'noreferrer' : undefined}
                target={item.external ? '_blank' : undefined}
              >
                {item.label}
              </a>
            ))}
            {showThemeMenu ? <ThemeMenu /> : null}
            {githubSocialLink ? (
              <a
                aria-label={`${siteConfig.title} on GitHub`}
                className={`${styles.iconButton} ${styles.github}`}
                href={githubSocialLink.href}
                rel="noreferrer"
                target="_blank"
              >
                <GithubIcon aria-hidden size={16} strokeWidth={1.8} />
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {sheetState !== 'closed'
        ? createPortal(
            <div className={styles.sheetLayer} data-state={sheetState}>
              <button
                aria-label="Close documentation navigation"
                className={styles.sheetBackdrop}
                tabIndex={-1}
                type="button"
                onClick={closeNavigation}
              />
              <aside
                aria-label="Documentation navigation"
                aria-modal="true"
                className={styles.sheet}
                id="mobile-documentation-navigation"
                role="dialog"
                onKeyDown={handleSheetKeyDown}
              >
                <div className={styles.sheetHeading}>
                  <span>Navigation</span>
                  <button
                    aria-label="Close documentation navigation"
                    className={styles.iconButton}
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeNavigation}
                  >
                    <X aria-hidden size={18} strokeWidth={1.8} />
                  </button>
                </div>
                <ScrollArea
                  disableContentFit
                  scrollFade
                  className={styles.sheetScroll}
                  contentProps={{ className: styles.sheetContent }}
                  scrollbarProps={{ className: styles.sheetScrollbar }}
                  viewportProps={{ className: styles.sheetViewport }}
                >
                  <Sidebar navigation={navigation} onNavigate={closeNavigation} />
                </ScrollArea>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
