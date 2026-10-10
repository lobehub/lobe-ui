'use client';

import * as stylex from '@stylexjs/stylex';
import { PanelLeft } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import Button from '@/Button';
import { Drawer } from '@/Drawer';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { useIsCompact, useLocalStorage, usePrefersReducedMotion } from '../hooks';
import { ConsoleShellContext } from './context';
import { consoleBrandMarker } from './marker.stylex';
import { styles } from './style';
import type { ConsoleShellProps, ConsoleShellState } from './type';

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
  collapseLabel = 'Collapse sidebar',
  defaultCollapsed = false,
  expandLabel = 'Expand sidebar',
  footer,
  hotkey = true,
  navigation,
  onCollapsedChange,
  openNavigationLabel = 'Open navigation',
  skipToContentLabel = 'Skip to content',
  storageKey,
  style,
  tools,
  ...rest
}: ConsoleShellProps) {
  const mainId = `console-main-${useId().replaceAll(':', '')}`;
  const shellRef = useRef<HTMLDivElement>(null);
  const isCompact = useIsCompact();
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
      {brand ? (
        <div data-collapsed={rail} {...stylex.props(styles.brand, consoleBrandMarker)}>
          {brand}
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
        <Drawer noHeader open={drawerOpen} placement="left" width={272} onClose={closeNavigation}>
          <Flexbox height="100%">{sidebar(false)}</Flexbox>
        </Drawer>
      ) : null}
      <div {...stylex.props(styles.workspace)}>
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
        <main id={mainId} tabIndex={-1} {...stylex.props(styles.main)}>
          {children}
        </main>
      </div>
    </div>
  );
}

ConsoleShell.displayName = 'ConsoleShell';

export default ConsoleShell;
