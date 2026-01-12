import { useLayoutEffect } from 'react';

type PopupStoreLike = {
  // Base UI store's `useState` has a strongly-typed key union; we keep it loose here on purpose.
  useState: (...args: any[]) => unknown;
};

const isInvalidTriggerElement = (el: Element | null): boolean => {
  if (!el) return true;
  if (!el.isConnected) return true;

  // "display: none" on self or an ancestor effectively hides the trigger.
  // `getComputedStyle` can throw in some edge cases (e.g. non-Element in old envs),
  // so we guard it defensively.
  try {
    return getComputedStyle(el).display === 'none';
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

  // These are Base UI store selectors; both TooltipStore and PopoverStore support them.
  const open = store.useState('open') as boolean;
  const activeTriggerElement = store.useState('activeTriggerElement') as Element | null;

  const shouldWatch = enabled && open;

  // Use layout effect so the first check runs right after React commits DOM updates.
  // Then keep watching via rAF while open to also capture CSS-driven visibility changes.
  useLayoutEffect(() => {
    if (!shouldWatch) return;

    let raf = 0;

    const loop = () => {
      if (isInvalidTriggerElement(activeTriggerElement)) {
        destroy();
        return;
      }
      raf = window.requestAnimationFrame(loop);
    };

    loop();
    return () => window.cancelAnimationFrame(raf);
  }, [activeTriggerElement, destroy, shouldWatch]);
};
