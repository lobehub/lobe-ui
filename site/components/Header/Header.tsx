import './Header.css';

import { Menu, Monitor, Moon, Search, Sun, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';

import LobeHubText from '../../../src/brand/LobeHubText';
import GithubIcon from '../../../src/icons/lucideExtra/GithubIcon';
import type { ThemePreference } from '../../app/providers/themeStore';
import type { NavigationSection } from '../../types/content';
import Sidebar from '../Sidebar/Sidebar';

interface HeaderProps {
  navigation: NavigationSection[];
  onPreferenceChange: (preference: ThemePreference) => void;
  preference: ThemePreference;
}

const themes = [
  { icon: Sun, label: 'Use light theme', preference: 'light' },
  { icon: Monitor, label: 'Use system theme', preference: 'system' },
  { icon: Moon, label: 'Use dark theme', preference: 'dark' },
] as const;

const SHEET_EXIT_DURATION = 180;

export default function Header({ navigation, onPreferenceChange, preference }: HeaderProps) {
  const [sheetState, setSheetState] = useState<'closed' | 'closing' | 'open'>('closed');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const openNavigation = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    setSheetState('open');
  }, []);

  const closeNavigation = useCallback(() => {
    if (sheetState === 'closed') return;
    window.clearTimeout(closeTimerRef.current);
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

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__brand-group">
            <button
              aria-controls="mobile-documentation-navigation"
              aria-expanded={sheetState !== 'closed'}
              aria-label="Open documentation navigation"
              className="site-header__icon-button site-header__menu-button"
              ref={menuButtonRef}
              type="button"
              onClick={openNavigation}
            >
              <Menu aria-hidden size={18} strokeWidth={1.8} />
            </button>
            <Link aria-label="Lobe UI documentation home" className="site-header__brand" to="/">
              <LobeHubText aria-hidden className="site-header__wordmark" size={22} />
              <span className="site-header__product-name">UI</span>
              <span className="site-header__product-kind">Docs</span>
            </Link>
          </div>

          <button
            disabled
            aria-label="Search documentation"
            className="site-header__search"
            title="Search indexing is provided by the documentation migration"
            type="button"
          >
            <Search aria-hidden size={16} strokeWidth={1.8} />
            <span>Search documentation</span>
            <kbd>⌘ K</kbd>
          </button>

          <div className="site-header__actions">
            <div aria-label="Theme preference" className="site-header__theme-selector" role="group">
              {themes.map(({ icon: ThemeIcon, label, preference: themePreference }) => (
                <button
                  aria-label={label}
                  aria-pressed={preference === themePreference}
                  key={themePreference}
                  title={label}
                  type="button"
                  onClick={() => onPreferenceChange(themePreference)}
                >
                  <ThemeIcon aria-hidden size={15} strokeWidth={1.8} />
                </button>
              ))}
            </div>
            <a
              aria-label="Lobe UI on GitHub"
              className="site-header__icon-button site-header__github"
              href="https://github.com/lobehub/lobe-ui"
              rel="noreferrer"
              target="_blank"
            >
              <GithubIcon aria-hidden size={17} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </header>

      {sheetState !== 'closed'
        ? createPortal(
            <div className="site-header__sheet-layer" data-state={sheetState}>
              <button
                aria-label="Close documentation navigation"
                className="site-header__sheet-backdrop"
                tabIndex={-1}
                type="button"
                onClick={closeNavigation}
              />
              <aside
                aria-label="Documentation navigation"
                aria-modal="true"
                className="site-header__sheet"
                id="mobile-documentation-navigation"
                role="dialog"
                onKeyDown={handleSheetKeyDown}
              >
                <div className="site-header__sheet-heading">
                  <span>Navigation</span>
                  <button
                    aria-label="Close documentation navigation"
                    className="site-header__icon-button"
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
