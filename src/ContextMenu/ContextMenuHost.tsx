'use client';

import { ContextMenu } from '@base-ui/react/context-menu';
import { memo, useEffect, useMemo, useSyncExternalStore } from 'react';

import { LOBE_THEME_APP_ID } from '@/ThemeProvider';
import { useIsClient } from '@/hooks/useIsClient';
import { usePortalContainer } from '@/hooks/usePortalContainer';
import { registerDevSingleton } from '@/utils/devSingleton';
import { preventDefaultAndStopPropagation } from '@/utils/dom';

import { renderContextMenuItems } from './renderItems';
import {
  closeContextMenu,
  getServerSnapshot,
  getSnapshot,
  setContextMenuState,
  subscribe,
  updateLastPointer,
} from './store';
import { styles } from './style';

const CONTEXT_MENU_CONTAINER_ATTR = 'data-lobe-ui-context-menu-container';

export const ContextMenuHost = memo(() => {
  const isClient = useIsClient();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const DEV = process.env.NODE_ENV === 'development';
    if (!isClient || !DEV) return;
    // Enforce singleton per portal container (dev-only).
    const themeApp = document.querySelector<HTMLElement>(`#${LOBE_THEME_APP_ID}`);
    const contextMenuContainer = document.querySelector<HTMLElement>(
      `[${CONTEXT_MENU_CONTAINER_ATTR}="true"]`,
    );
    const scope = themeApp ?? contextMenuContainer ?? document.body;
    return registerDevSingleton('ContextMenuHost', scope);
  }, [isClient]);

  useEffect(() => {
    const handler = (event: MouseEvent | PointerEvent) => updateLastPointer(event);
    window.addEventListener('pointerdown', handler, true);
    window.addEventListener('contextmenu', handler, true);
    return () => {
      window.removeEventListener('pointerdown', handler, true);
      window.removeEventListener('contextmenu', handler, true);
    };
  }, []);

  const menuItems = useMemo(
    () => renderContextMenuItems(state.items, [], { iconSpaceMode: state.iconSpaceMode }),
    [state.items, state.iconSpaceMode],
  );
  const portalContainer = usePortalContainer(CONTEXT_MENU_CONTAINER_ATTR);

  if (!isClient) return null;
  if (!state.open && state.items.length === 0) return null;
  if (!portalContainer) return null;

  return (
    <ContextMenu.Root
      onOpenChange={(open) => {
        if (open) {
          setContextMenuState({ open });
          return;
        }
        closeContextMenu();
      }}
      open={state.open}
    >
      <ContextMenu.Portal container={portalContainer}>
        <ContextMenu.Positioner
          anchor={state.anchor ?? undefined}
          className={styles.positioner}
          sideOffset={6}
        >
          <ContextMenu.Popup
            className={styles.popup}
            onContextMenu={preventDefaultAndStopPropagation}
          >
            {menuItems}
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
});

ContextMenuHost.displayName = 'ContextMenuHost';
