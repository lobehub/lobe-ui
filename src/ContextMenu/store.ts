import type { VirtualElement } from '@floating-ui/react';

import type { GenericItemType } from '@/Menu';

export type ContextMenuState = {
  anchor: VirtualElement | null;
  items: GenericItemType[];
  open: boolean;
};

const emptyState: ContextMenuState = {
  anchor: null,
  items: [],
  open: false,
};

let contextMenuState: ContextMenuState = emptyState;
const listeners = new Set<() => void>();
const lastPointer = { ready: false, x: 0, y: 0 };

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getSnapshot = () => contextMenuState;
export const getServerSnapshot = () => emptyState;

export const updateLastPointer = (event: MouseEvent | PointerEvent) => {
  lastPointer.x = event.clientX;
  lastPointer.y = event.clientY;
  lastPointer.ready = true;
};

const createVirtualElement = (point: { x: number; y: number }): VirtualElement => ({
  contextElement: typeof document === 'undefined' ? undefined : document.body,
  getBoundingClientRect: () =>
    ({
      bottom: point.y,
      height: 0,
      left: point.x,
      right: point.x,
      toJSON: () => undefined,
      top: point.y,
      width: 0,
      x: point.x,
      y: point.y,
    }) as DOMRect,
});

export const setContextMenuState = (next: Partial<ContextMenuState>) => {
  contextMenuState = { ...contextMenuState, ...next };
  notify();
};

export const showContextMenu = (items: GenericItemType[]) => {
  if (typeof window === 'undefined') return;

  const fallbackPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const point = lastPointer.ready ? { x: lastPointer.x, y: lastPointer.y } : fallbackPoint;

  setContextMenuState({
    anchor: createVirtualElement(point),
    items,
    open: true,
  });
};

export const closeContextMenu = () => {
  setContextMenuState({ anchor: null, items: [], open: false });
};
