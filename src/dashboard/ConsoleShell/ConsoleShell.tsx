'use client';

import * as stylex from '@stylexjs/stylex';
import { PanelLeft, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import Button from '@/Button';
import { Drawer } from '@/Drawer';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import ConsoleNavSkeleton, { ConsoleFooterSkeleton } from '../ConsoleNav/Skeleton';
import { useIsCompact, useLocalStorage, usePrefersReducedMotion } from '../hooks';
import PageLoading from '../PageSkeleton';
import { ConsoleShellContext } from './context';
import { consoleBrandMarker } from './marker.stylex';
import { styles } from './style';
import type { ConsoleShellProps, ConsoleShellState } from './type';

// The drawer body is the scroll container. Without its default padding the scrollbar sits on
// the panel edge; the brand row, nav and footer keep their own insets.
const drawerBodyStyle = { minBlockSize: '100%', padding: 0 };

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

function ConsoleShell({
  brand,
  breadcrumb,
  children,
  className,
  collapsed,
  closeNavigationLabel = 'Close navigation',
  collapseLabel = 'Collapse sidebar',
  defaultCollapsed = false,
  expandLabel = 'Expand sidebar',
  footer: footerProp,
  loading,
  loadingContent,
  loadingNavigation,
  hotkey = true,
  navigation: navigationProp,
  onCollapsedChange,
  openNavigationLabel = 'Open navigation',
  skipToContentLabel = 'Skip to content',
  storageKey,
  style,
  tools,
  ...rest
}: ConsoleShellProps) {
  const navigation = loading ? (loadingNavigation ?? <ConsoleNavSkeleton />) : navigationProp;
  const footer = loading ? <ConsoleFooterSkeleton /> : footerProp;
  const body = loading ? (loadingContent ?? <PageLoading />) : children;
  const mainId = `console-main-${useId().replaceAll(':', '')}`;
  const shellRef = useRef<HTMLDivElement>(null);
  const isCompact = useIsCompact();
  const { isDarkMode } = useThemeMode();
  const reducedMotion = usePrefersReducedMotion();
  const [storedCollapsed, setStoredCollapsed] = useLocalStorage(storageKey, defaultCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isControlled = collapsed !== undefined;
  const railCollapsed = isControlled ? collapsed : storedCollapsed;
  const railed = railCollapsed && !isCompact;

  const setCollapsed = (next: boolean) => {
    if (!isControlled) setStoredCollapsed(next);
    onCollapsedChange?.(next);
  };

  const closeNavigation = () => setDrawerOpen(false);
  const toggleNavigation = () => {
    if (isCompact) {
      setDrawerOpen((open) => !open);
      return;
    }
    setCollapsed(!railCollapsed);
  };
  const toggleRef = useRef(toggleNavigation);
  toggleRef.current = toggleNavigation;

  useEffect(() => {
    if (!hotkey) return;
    const node = shellRef.current;
    if (!node) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'b' || !(event.metaKey || event.ctrlKey) || event.altKey) {
        return;
      }
      if (event.repeat || isTypingTarget(event.target)) return;
      if (!node.contains(event.target as Node)) return;
      event.preventDefault();
      toggleRef.current();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hotkey]);

  const stateFor = (rail: boolean): ConsoleShellState => ({
    closeNavigation,
    collapsed: rail,
    compact: isCompact,
  });

  const sidebar = (rail: boolean) => (
    <ConsoleShellContext value={stateFor(rail)}>
      {brand || isCompact ? (
        <div data-collapsed={rail} {...stylex.props(styles.brand, consoleBrandMarker)}>
          {brand}
          {isCompact ? (
            // In the drawer the close button sits in the brand row's flow, so it never
            // overlaps a brand switcher the way the drawer's floating close button did.
            <Button
              aria-label={closeNavigationLabel}
              className={stylex.props(styles.brandClose).className}
              icon={X}
              type="text"
              onClick={closeNavigation}
            />
          ) : null}
        </div>
      ) : null}
      {navigation ? <div {...stylex.props(styles.navSlot)}>{navigation}</div> : null}
      {footer ? <div {...stylex.props(styles.sidebarBottom)}>{footer}</div> : null}
    </ConsoleShellContext>
  );

  const toggleLabel = isCompact ? openNavigationLabel : railed ? expandLabel : collapseLabel;

  return (
    <div
      data-console-shell=""
      ref={shellRef}
      {...styleProps(styles.shell, className, style)}
      {...rest}
    >
      <a
        href={`#${mainId}`}
        onClick={(event) => {
          event.preventDefault();
          document.getElementById(mainId)?.focus();
        }}
        {...stylex.props(styles.skipLink)}
      >
        {skipToContentLabel}
      </a>
      <aside
        data-collapsed={railed}
        data-instant={reducedMotion}
        {...stylex.props(
          styles.sidebar,
          railed && styles.sidebarCollapsed,
          reducedMotion && styles.sidebarInstant,
        )}
      >
        {!isCompact && sidebar(railed)}
      </aside>
      {isCompact ? (
        <Drawer
          noHeader
          closable={false}
          open={drawerOpen}
          placement="left"
          styles={{ bodyContent: drawerBodyStyle }}
          width={272}
          onClose={closeNavigation}
        >
          <Flexbox height="100%">{sidebar(false)}</Flexbox>
        </Drawer>
      ) : null}
      <div {...stylex.props(styles.workspace, !isDarkMode && styles.workspaceLight)}>
        <header {...stylex.props(styles.topbar)}>
          <Button
            aria-label={toggleLabel}
            icon={PanelLeft}
            type="text"
            onClick={toggleNavigation}
          />
          <span aria-hidden {...stylex.props(styles.topbarDivider)} />
          <div {...stylex.props(styles.topbarMain)}>{breadcrumb}</div>
          {tools ? <div {...stylex.props(styles.tools)}>{tools}</div> : null}
        </header>
        <main
          aria-busy={loading || undefined}
          id={mainId}
          tabIndex={-1}
          {...stylex.props(styles.main)}
        >
          {body}
        </main>
      </div>
    </div>
  );
}

ConsoleShell.displayName = 'ConsoleShell';

export default ConsoleShell;
