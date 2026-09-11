import { useLayoutEffect, useRef, useState } from 'react';

type PopupStoreLike = {
  state: {
    activeTriggerElement?: Element | null;
    open?: boolean;
    popupElement?: HTMLElement | null;
  };
  useState?: (...args: any[]) => unknown;
};

export const FAR_TRIGGER_SWITCH_THRESHOLD = 280;

const REPOP_ANIMATION: [Keyframe[], KeyframeAnimationOptions] = [
  [
    { opacity: 0, scale: 0.97 },
    { opacity: 1, scale: 1 },
  ],
  { duration: 200, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' },
];

const centerOf = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A morph across a long distance reads as a stray box flying over the page, so past `threshold`
// the switch is made instant and the popup re-plays a short enter animation at the new anchor.
export const useRepopOnFarTriggerSwitch = (
  store: PopupStoreLike,
  options?: { enabled?: boolean; threshold?: number },
): boolean => {
  const enabled = options?.enabled ?? true;
  const threshold = options?.threshold ?? FAR_TRIGGER_SWITCH_THRESHOLD;

  const activeTrigger =
    (store.useState?.('activeTriggerElement') as Element | null | undefined) ??
    store.state.activeTriggerElement ??
    null;
  const open = (store.useState?.('open') as boolean | undefined) ?? Boolean(store.state.open);
  const popupElement =
    (store.useState?.('popupElement') as HTMLElement | null | undefined) ??
    store.state.popupElement ??
    null;

  const lastRef = useRef<{ center: { x: number; y: number } | null; el: Element | null }>({
    center: null,
    el: null,
  });
  const [repop, setRepop] = useState(false);

  useLayoutEffect(() => {
    if (!open || !enabled) {
      lastRef.current = { center: null, el: null };
      setRepop(false);
      return;
    }
    const last = lastRef.current;
    if (activeTrigger === last.el) return;

    const center = activeTrigger ? centerOf(activeTrigger) : null;
    const far = Boolean(
      last.el &&
      last.center &&
      center &&
      Math.hypot(center.x - last.center.x, center.y - last.center.y) > threshold,
    );
    lastRef.current = { center, el: activeTrigger };
    setRepop(far);

    if (far && popupElement && !prefersReducedMotion()) {
      popupElement.animate?.(...REPOP_ANIMATION);
    }
  }, [activeTrigger, enabled, open, popupElement, threshold]);

  return repop;
};
