'use client';

import clsx from 'clsx';
import { PanelLeft, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import Button from '@/Button';
import { Drawer } from '@/Drawer';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import ConsoleNavSkeleton, { ConsoleFooterSkeleton } from '../ConsoleNav/Skeleton';
import { useIsCompact, useLocalStorage, usePrefersReducedMotion } from '../hooks';
import PageLoading from '../PageSkeleton';
import { ConsoleShellContext } from './context';
import { consoleBrandMarker } from './marker.stylex';
import { dashboardConsoleShellClasses } from './stable';
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
        <div
          data-collapsed={rail}
          {...styleProps([styles.brand, consoleBrandMarker], dashboardConsoleShellClasses('brand'))}
        >
          {brand}
          {isCompact ? (
            // In the drawer the close button sits in the brand row's flow, so it never
            // overlaps a brand switcher the way the drawer's floating close button did.
            <Button
              aria-label={closeNavigationLabel}
              icon={X}
              type="text"
              className={
                styleProps(styles.brandClose, dashboardConsoleShellClasses('brand-close')).className
              }
              onClick={closeNavigation}
            />
          ) : null}
        </div>
      ) : null}
      {navigation ? (
        <div {...styleProps(styles.navSlot, dashboardConsoleShellClasses('nav'))}>{navigation}</div>
      ) : null}
      {footer ? (
        <div {...styleProps(styles.sidebarBottom, dashboardConsoleShellClasses('footer'))}>
          {footer}
        </div>
      ) : null}
    </ConsoleShellContext>
  );

  const toggleLabel = isCompact ? openNavigationLabel : railed ? expandLabel : collapseLabel;

  return (
    <div
      data-console-shell=""
      ref={shellRef}
      {...styleProps(styles.shell, clsx(dashboardConsoleShellClasses(), className), style)}
      {...toDataAttributes({ collapsed: railed, compact: isCompact })}
      {...rest}
    >
      <a
        href={`#${mainId}`}
        onClick={(event) => {
          event.preventDefault();
          document.getElementById(mainId)?.focus();
        }}
        {...styleProps(styles.skipLink, dashboardConsoleShellClasses('skip-link'))}
      >
        {skipToContentLabel}
      </a>
      <aside
        data-collapsed={railed}
        data-instant={reducedMotion}
        {...styleProps(
          [
            styles.sidebar,
            railed && styles.sidebarCollapsed,
            reducedMotion && styles.sidebarInstant,
          ],
          dashboardConsoleShellClasses('sidebar'),
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
      <div
        {...styleProps(
          [styles.workspace, !isDarkMode && styles.workspaceLight],
          dashboardConsoleShellClasses('workspace'),
        )}
      >
        <header {...styleProps(styles.topbar, dashboardConsoleShellClasses('topbar'))}>
          <Button
            aria-label={toggleLabel}
            className={dashboardConsoleShellClasses('toggle')}
            icon={PanelLeft}
            type="text"
            onClick={toggleNavigation}
          />
          <span
            aria-hidden
            {...styleProps(styles.topbarDivider, dashboardConsoleShellClasses('topbar-divider'))}
          />
          <div {...styleProps(styles.topbarMain, dashboardConsoleShellClasses('topbar-main'))}>
            {breadcrumb}
          </div>
          {tools ? (
            <div {...styleProps(styles.tools, dashboardConsoleShellClasses('tools'))}>{tools}</div>
          ) : null}
        </header>
        <main
          aria-busy={loading || undefined}
          id={mainId}
          tabIndex={-1}
          {...styleProps(styles.main, dashboardConsoleShellClasses('main'))}
        >
          {body}
        </main>
      </div>
    </div>
  );
}

ConsoleShell.displayName = 'ConsoleShell';

export default ConsoleShell;
