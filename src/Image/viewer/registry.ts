import { type RefObject, useCallback, useSyncExternalStore } from 'react';

import type { ImagePreviewOptions } from '../type';

export interface ResolvedPreviewOptions extends Omit<ImagePreviewOptions, 'maxScale'> {
  maxScale: number;
}

export interface PreviewEntry {
  element: HTMLImageElement;
  options: ResolvedPreviewOptions;
  previewSrc?: string;
  src: string;
}

export interface PreviewSession {
  entry: PreviewEntry;
  token: number;
}

interface HostState extends PreviewSession {
  closing: boolean;
}

let state: HostState | null = null;
let nextToken = 0;

const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

const flushClosed = () => {
  if (!state || state.closing) return;
  state.closing = true;
  state.entry.options.onOpenChange?.(false);
};

export const openPreview = (entry: PreviewEntry): void => {
  flushClosed();
  nextToken += 1;
  state = { closing: false, entry, token: nextToken };
  emit();
  entry.options.onOpenChange?.(true);
};

export const beginClosePreview = (token: number): void => {
  if (state?.token !== token) return;
  flushClosed();
};

export const endClosePreview = (token: number): void => {
  if (state?.token !== token) return;
  flushClosed();
  state = null;
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getServerSnapshot = (): PreviewSession | null => null;

export const usePreviewSession = (
  elementRef: RefObject<HTMLImageElement | null>,
): PreviewSession | null => {
  const getSnapshot = useCallback(
    () => (state && state.entry.element === elementRef.current ? state : null),
    [elementRef],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
