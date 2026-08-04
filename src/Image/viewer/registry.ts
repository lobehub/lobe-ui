import { type RefObject, useCallback, useSyncExternalStore } from 'react';

import type { ImagePreviewOptions } from '../type';
import type { ZoomPolicy } from './geometry';

export interface ResolvedPreviewOptions extends Omit<
  ImagePreviewOptions,
  'autoZoomThreshold' | 'defaultZoom' | 'maxScale'
> {
  autoZoomThreshold: number;
  defaultZoom: ZoomPolicy;
  maxScale: number;
}

export interface PreviewEntry {
  element: HTMLImageElement;
  options: ResolvedPreviewOptions;
  previewSrc?: string;
  src: string;
}

export interface PreviewSession {
  entries: PreviewEntry[];
  index: number;
  openerFocusElement: HTMLElement | null;
  token: number;
}

interface HostState extends PreviewSession {
  closing: boolean;
  onOpenChange?: (open: boolean) => void;
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
  state.onOpenChange?.(false);
};

// openerFocusElement must be captured by the caller at pointerdown, not read here:
// clicking a non-focusable thumbnail already blurs to document.body before its
// click handler (and therefore this call) runs.
export const openPreview = (
  entry: PreviewEntry,
  entries?: PreviewEntry[],
  index = 0,
  openerFocusElement: HTMLElement | null = null,
): void => {
  flushClosed();
  nextToken += 1;
  const resolvedEntries = entries && entries.length > 0 ? entries : [entry];
  const resolvedIndex =
    entries && entries.length > 0 ? Math.min(Math.max(index, 0), entries.length - 1) : 0;
  state = {
    closing: false,
    entries: resolvedEntries,
    index: resolvedIndex,
    onOpenChange: entry.options.onOpenChange,
    openerFocusElement,
    token: nextToken,
  };
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
    () => (state && state.entries[state.index]?.element === elementRef.current ? state : null),
    [elementRef],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
