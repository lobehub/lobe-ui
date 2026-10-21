import './DocsShell.css';

import { Hotkey, ScrollArea, type ScrollAreaViewportProps } from '@lobehub/ui';
import { LobeHub } from '@lobehub/ui/brand';
import { Breadcrumb, ConsoleBrand, ConsoleNav, ConsoleShell } from '@lobehub/ui/dashboard';
import { GithubIcon } from '@lobehub/ui/icons';
import * as stylex from '@stylexjs/stylex';
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { getScrollContainer } from '../../lib/scroller';
import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import { buildBreadcrumb, buildNavGroups, buildNavItems } from './navigation';
import { styles } from './style';
import { ThemeMenu } from './ThemeMenu';

interface DocsShellProps {
  children: ReactNode;
  documents: DocumentManifestEntry[];
  navigation: NavigationSection[];
  onSearchOpen: (trigger: HTMLButtonElement) => void;
}

const LOGO_SIZE = 24;

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * `ScrollRestoration` only restores the window, so the shell workspace keeps
 * its own per-entry offsets and resets to the top on forward navigation.
 */
function useWorkspaceScrollRestoration() {
  const { hash, key, pathname } = useLocation();
  const navigationType = useNavigationType();
  const positionsRef = useRef(new Map<string, number>());
  const currentKeyRef = useRef(key);

  useEffect(() => {
    const container = getScrollContainer();
    if (!container) return;
    const handleScroll = () => positionsRef.current.set(currentKeyRef.current, container.scrollTop);
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useIsomorphicLayoutEffect(() => {
    currentKeyRef.current = key;
    const container = getScrollContainer();
    if (!container) return;

    const saved = positionsRef.current.get(key);
    if (navigationType === 'POP' && saved !== undefined) {
      container.scrollTop = saved;
    } else if (!hash) {
      container.scrollTop = 0;
    }
  }, [key, pathname]);
}

function useMainFocusForwarding() {
  useEffect(() => {
    const viewport = getScrollContainer();
    const main = viewport?.closest('main');
    if (!viewport || !main) return;

    const forwardFocus = (event: FocusEvent) => {
      if (event.target === main) viewport.focus({ preventScroll: true });
    };
    main.addEventListener('focus', forwardFocus);
    return () => main.removeEventListener('focus', forwardFocus);
  }, []);
}

export function DocsShell({ children, documents, navigation, onSearchOpen }: DocsShellProps) {
  const { pathname } = useLocation();
  const [isAppleShortcut, setIsAppleShortcut] = useState(false);

  useWorkspaceScrollRestoration();
  useMainFocusForwarding();

  useEffect(() => {
    setIsAppleShortcut(/mac|iphone|ipod|ipad|ios/i.test(navigator.userAgent));
  }, []);

  const themeConfig = siteConfig.themeConfig;
  const actions = themeConfig?.actions ?? [];
  const githubSocialLink = themeConfig?.socialLinks?.find((link) => link.icon === 'github');
  const productName = siteConfig.title.replace(/^Lobe(?:Hub)?\s+/i, '') || siteConfig.title;
  const showThemeMenu = (themeConfig?.prefersColor ?? 'auto') === 'auto';

  const brand = (
    <ConsoleBrand
      label={`${siteConfig.title} documentation home`}
      logo={
        <LobeHub className="docs-brand-logo" extra={productName} size={LOGO_SIZE} type="combine" />
      }
      renderLink={({ children: content, href, ...linkProps }) => (
        <Link {...linkProps} to={href}>
          {content}
        </Link>
      )}
    />
  );

  const nav = (
    <ConsoleNav
      defaultExpanded="active"
      groups={buildNavGroups(navigation, themeConfig?.sidebarGroups)}
      items={buildNavItems(themeConfig?.navItems)}
      label="Documentation"
      pathname={pathname}
      storageKey="lobedocs-nav-expanded"
      renderLink={({ children: content, external, href, ...linkProps }) =>
        external ? (
          <a {...linkProps} href={href} rel="noreferrer" target="_blank">
            {content}
          </a>
        ) : (
          <Link {...linkProps} to={href}>
            {content}
          </Link>
        )
      }
    />
  );

  const breadcrumb = (
    <Breadcrumb
      items={buildBreadcrumb(navigation, documents, pathname)}
      renderLink={({ children: content, href, ...linkProps }) => (
        <Link {...linkProps} to={href}>
          {content}
        </Link>
      )}
    />
  );

  const tools = (
    <>
      <button
        aria-keyshortcuts="Meta+K Control+K"
        aria-label="Search documentation"
        {...stylex.props(styles.search)}
        type="button"
        onClick={(event) => onSearchOpen(event.currentTarget)}
      >
        <Search aria-hidden size={15} strokeWidth={1.8} />
        <span {...stylex.props(styles.searchLabel)}>Search</span>
        <Hotkey
          compact
          {...stylex.props(styles.searchHotkey)}
          isApple={isAppleShortcut}
          keys="mod+k"
        />
      </button>
      {actions.map((item) => (
        <a
          {...stylex.props(styles.actionLink)}
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
          {...stylex.props(styles.iconButton)}
          href={githubSocialLink.href}
          rel="noreferrer"
          target="_blank"
        >
          <GithubIcon aria-hidden size={16} strokeWidth={1.8} />
        </a>
      ) : null}
    </>
  );

  return (
    <ConsoleShell
      brand={brand}
      breadcrumb={breadcrumb}
      className="docs-shell"
      navigation={nav}
      openNavigationLabel="Open documentation navigation"
      skipToContentLabel="Skip to documentation"
      storageKey="lobedocs-sidebar-collapsed"
      tools={tools}
    >
      <ScrollArea
        disableContentFit
        data-page-layout="flush"
        {...stylex.props(styles.scrollArea)}
        contentProps={stylex.props(styles.scrollContent)}
        viewportProps={
          {
            ...stylex.props(styles.scrollViewport),
            'data-docs-scroll-viewport': '',
          } as ScrollAreaViewportProps
        }
      >
        {children}
      </ScrollArea>
    </ConsoleShell>
  );
}
