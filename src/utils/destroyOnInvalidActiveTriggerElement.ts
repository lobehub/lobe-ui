import { useLayoutEffect } from 'react';

type PopupStoreLike = {
  // Base UI store's `useState` has a strongly-typed key union; we keep it loose here on purpose.
  state: {
    activeTriggerElement?: Element | null;
    open?: boolean;
    positionerElement?: HTMLElement | null;
  };
  useState?: (...args: any[]) => unknown;
};

const isInvalidTriggerElement = (el: Element | null): boolean => {
  if (!el) return true;

  if (!el.isConnected) return true;

  // "display: none" on self or an ancestor effectively hides the trigger.
  // `getComputedStyle` can throw in some edge cases (e.g. non-Element in old envs),
  // so we guard it defensively.
  try {
    // Check self and all ancestors for display: none
    let current: Element | null = el;
    while (current) {
      if (getComputedStyle(current).display === 'none') {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Destroys (hard reset) a group popup (Tooltip/Popover) when its active trigger element becomes
 * disconnected from the DOM or is effectively hidden via `display: none`.
 *
 * We intentionally poll while open to also catch CSS-driven visibility changes that won't
 * necessarily trigger DOM mutation observers.
 */
export const useDestroyOnInvalidActiveTriggerElement = (
  store: PopupStoreLike,
  destroy: () => void,
  options?: {
    /**
     * @default true
     */
    enabled?: boolean;
  },
) => {
  const enabled = options?.enabled ?? true;

  // Subscribe with `useState` (reactive), but read from `state` (immediate) inside the loop.
  // Base UI note: `state` updates immediately, while `useState` reflects updates before the next render.
  const openReactive =
    (store.useState?.('open') as boolean | undefined) ?? Boolean(store.state.open);
  const shouldWatch = enabled && openReactive;

  // Use layout effect so the first check runs right after React commits DOM updates.
  // Then keep watching via rAF while open to also capture CSS-driven visibility changes.
  useLayoutEffect(() => {
    if (!shouldWatch) return;

    let raf = 0;

    const loop = () => {
      if (isInvalidTriggerElement(store.state.activeTriggerElement ?? null)) {
        destroy();
        return;
      }
      raf = window.requestAnimationFrame(loop);
    };

    loop();
    return () => window.cancelAnimationFrame(raf);
  }, [destroy, shouldWatch, store]);
};

/**
 * UI-only fallback: If the positioner ends up at viewport (0,0), hide it to avoid a visible flash
 * in the corner. This doesn't replace "destroy on invalid trigger"; it's purely a visual guard.
 */
export const useHidePopupWhenPositionerAtOrigin = (
  store: PopupStoreLike,
  options?: {
    /**
     * @default true
     */
    enabled?: boolean;
    /**
     * Pixel threshold to consider the element "at origin".
     * @default 0.5
     */
    threshold?: number;
  },
) => {
  const enabled = options?.enabled ?? true;
  const threshold = options?.threshold ?? 0.5;

  const openReactive =
    (store.useState?.('open') as boolean | undefined) ?? Boolean(store.state.open);
  const positionerElementReactive =
    (store.useState?.('positionerElement') as HTMLElement | null | undefined) ??
    store.state.positionerElement ??
    null;

  useLayoutEffect(() => {
    const positionerEl = store.state.positionerElement ?? positionerElementReactive;

    if (!enabled || !openReactive || !positionerEl) {
      if (positionerEl) delete positionerEl.dataset.zeroOrigin;
      return;
    }

    let raf = 0;
    const loop = () => {
      const current = store.state.positionerElement ?? positionerEl;
      if (!current) return;

      const rect = current.getBoundingClientRect();
      const atOrigin = Math.abs(rect.left) <= threshold && Math.abs(rect.top) <= threshold;
      if (atOrigin) current.dataset.zeroOrigin = 'true';
      else delete current.dataset.zeroOrigin;

      raf = window.requestAnimationFrame(loop);
    };

    loop();
    return () => {
      window.cancelAnimationFrame(raf);
      const current = store.state.positionerElement ?? positionerEl;
      if (current) delete current.dataset.zeroOrigin;
    };
  }, [enabled, openReactive, positionerElementReactive, store, threshold]);
};
