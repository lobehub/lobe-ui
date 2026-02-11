'use client';

import { ContextMenu } from '@base-ui/react/context-menu';
import { memo, useEffect, useMemo, useSyncExternalStore } from 'react';

import { useIsClient } from '@/hooks/useIsClient';
import { useAppElement } from '@/ThemeProvider';
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

export const ContextMenuHost = memo(() => {
  const isClient = useIsClient();
  const appElement = useAppElement();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const DEV = process.env.NODE_ENV === 'development';
    if (!isClient || !DEV) return;
    return registerDevSingleton('ContextMenuHost', document.body);
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
    () =>
      renderContextMenuItems(state.items, [], {
        iconAlign: state.iconAlign,
        iconSpaceMode: state.iconSpaceMode,
      }),
    [state.items, state.iconAlign, state.iconSpaceMode],
  );
  if (!isClient) return null;
  if (!state.open && state.items.length === 0) return null;

  return (
    <ContextMenu.Root
      open={state.open}
      onOpenChange={(open) => {
        if (open) {
          setContextMenuState({ open });
          return;
        }
        closeContextMenu();
      }}
    >
      <ContextMenu.Portal container={appElement ?? undefined}>
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
