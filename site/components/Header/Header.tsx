import { LobeHubText } from '@lobehub/ui/brand';
import type { DropdownItem } from '@lobehub/ui/DropdownMenu';
import DropdownMenu from '@lobehub/ui/DropdownMenu';
import { GithubIcon } from '@lobehub/ui/icons/lucideExtra';
import { Ellipsis, Menu, Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router';

import { findSectionByPathname, sectionLandingPathname } from '../../content/pageChrome';
import type { NavigationSection } from '../../types/content';
import Sidebar from '../Sidebar/Sidebar';
import { styles } from './style';
import ThemeMenu from './ThemeMenu';

interface HeaderProps {
  navigation: NavigationSection[];
  onSearchOpen: (trigger: HTMLButtonElement) => void;
}

const LOGO_URL =
  'https://registry.npmmirror.com/@lobehub/assets-logo/1.2.0/files/assets/logo-3d.webp';

// LobeHubText viewBox keeps ~49% vertical padding, so the wordmark box must
// be larger than the 3d logo for letter ink to optically match the icon.
const LOGO_SIZE = 20;

const primarySectionTitles = ['Components', 'Base UI', 'Chat', 'Icons', 'Brand'];

const NavIndicator = () => (
  <motion.span
    aria-hidden
    className={styles.navIndicator}
    layoutId="site-header-nav-indicator"
    transition={{ bounce: 0.25, duration: 0.4, type: 'spring' }}
  />
);

const SHEET_EXIT_DURATION = 180;

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

export default function Header({ navigation, onSearchOpen }: HeaderProps) {
  const [sheetState, setSheetState] = useState<'closed' | 'closing' | 'open'>('closed');
  const [atTop, setAtTop] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeSection = findSectionByPathname(navigation, pathname);
  const primarySections = primarySectionTitles
    .map((title) => navigation.find((section) => section.title === title))
    .filter((section) => section !== undefined);
  const overflowSections = navigation.filter(
    (section) => !primarySectionTitles.includes(section.title),
  );

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

  const moreItems: DropdownItem[] = [
    ...overflowSections.map((section) => ({
      key: section.title,
      label: section.title,
      onClick: () => navigate(sectionLandingPathname(section)),
    })),
    { type: 'divider' as const },
    { key: 'changelog', label: 'Changelog', onClick: () => navigate('/changelog') },
  ];

  return (
    <>
      <header className={styles.root} data-transparent={isHome && atTop ? '' : undefined}>
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

          <Link aria-label="Lobe UI documentation home" className={styles.brand} to="/">
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
            <span className={styles.productName}>UI</span>
          </Link>

          <nav aria-label="Documentation sections" className={styles.nav}>
            <Link aria-current={isHome ? 'page' : undefined} className={styles.navLink} to="/">
              Home
              {isHome ? <NavIndicator /> : null}
            </Link>
            {primarySections.map((section) => (
              <Link
                aria-current={section === activeSection ? 'true' : undefined}
                className={styles.navLink}
                key={section.title}
                to={sectionLandingPathname(section)}
              >
                {section.title}
                {section === activeSection ? <NavIndicator /> : null}
              </Link>
            ))}
            {overflowSections.length > 0 ? (
              <DropdownMenu items={moreItems} placement="bottomLeft">
                <button
                  aria-label="More documentation sections"
                  className={`${styles.navLink} ${styles.moreButton}`}
                  type="button"
                >
                  <Ellipsis aria-hidden size={16} strokeWidth={1.8} />
                </button>
              </DropdownMenu>
            ) : null}
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
              <kbd>⌘K</kbd>
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
            <ThemeMenu />
            <a
              aria-label="Lobe UI on GitHub"
              className={`${styles.iconButton} ${styles.github}`}
              href="https://github.com/lobehub/lobe-ui"
              rel="noreferrer"
              target="_blank"
            >
              <GithubIcon aria-hidden size={16} strokeWidth={1.8} />
            </a>
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
                <Sidebar navigation={navigation} onNavigate={closeNavigation} />
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
