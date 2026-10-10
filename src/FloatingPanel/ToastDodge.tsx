import { useEffect, useRef } from 'react';

import {
  PANEL_ALIGN_INLINE_VAR,
  PANEL_RESERVE_VAR,
  resolveToastDodge,
  TOAST_SHIFT_X_VAR,
  TOAST_SHIFT_Y_VAR,
  TOAST_WIDTH,
  TOAST_WIDTH_VAR,
} from '../Toast/dodge';

const TOAST_VARS = [TOAST_SHIFT_X_VAR, TOAST_SHIFT_Y_VAR, TOAST_WIDTH_VAR];

// A closing panel unmounts after its exit animation, so it can outlive the
// panel that replaced it. Only the panel that wrote the vars may clear them.
let owner: object | undefined;

// Mounted inside the panel so it lives exactly as long as the panel does, and
// reads its own parentElement to measure it.
export const ToastDodge = () => {
  const probeRef = useRef<HTMLSpanElement>(null);
  const reserveRef = useRef(0);
  const tokenRef = useRef({});
  const insetRef = useRef<{ x: number; y: number }>(undefined);

  useEffect(() => {
    const root = document.documentElement;
    const panel = probeRef.current?.parentElement;

    const token = tokenRef.current;
    const wrapper = panel?.parentElement;
    const clear = () => {
      reserveRef.current = 0;
      // The reserve lives on this panel's own wrapper, so it is always ours to
      // drop; the toast vars are global and only the last writer may clear them.
      if (wrapper instanceof HTMLElement) {
        wrapper.style.removeProperty(PANEL_RESERVE_VAR);
        wrapper.style.removeProperty(PANEL_ALIGN_INLINE_VAR);
      }
      if (owner !== token) return;
      owner = undefined;
      for (const name of TOAST_VARS) root.style.removeProperty(name);
    };

    if (!panel) return;

    const apply = () => {
      if (!(panel instanceof HTMLElement) || !(wrapper instanceof HTMLElement)) return;
      // Read the resting insets once, before anything is reserved: the wrapper
      // padding animates, so sampling it later feeds the transition's midpoint
      // back into the verdict and the reserve ratchets upward every frame.
      if (!insetRef.current) {
        const padding = getComputedStyle(wrapper);
        insetRef.current = {
          x: Number.parseFloat(padding.paddingInlineEnd) || 0,
          y: Number.parseFloat(padding.paddingBlockEnd) || 0,
        };
      }
      // Layout size, never getBoundingClientRect: the rect carries the entrance
      // animation's transform, so measuring mid-flight reports a scaled-down
      // panel and the toast lands short of the gutter.
      const inset = insetRef.current;
      // Measure the panel as if it were not already yielding, otherwise the
      // reserve it applies shrinks the panel and flips the next verdict.
      // Only add the reserve back when max-height is what is holding the panel
      // down; a panel shorter than its cap was never shrunk by it.
      const maxHeight = Number.parseFloat(getComputedStyle(panel).maxHeight);
      const reserved = reserveRef.current;
      const clamped = panel.offsetHeight >= maxHeight - 0.5 ? reserved : 0;
      const dodge = resolveToastDodge({
        panelHeight: panel.offsetHeight + clamped,
        panelOffsetX: inset.x,
        panelOffsetY: inset.y,
        panelWidth: panel.offsetWidth,
        viewportHeight: wrapper.clientHeight,
        viewportWidth: wrapper.clientWidth,
      });

      owner = token;
      reserveRef.current = dodge.reserve;
      root.style.setProperty(TOAST_SHIFT_X_VAR, `${dodge.shiftX}px`);
      root.style.setProperty(TOAST_SHIFT_Y_VAR, `${dodge.shiftY}px`);
      wrapper.style.setProperty(PANEL_RESERVE_VAR, `${dodge.reserve}px`);
      wrapper.style.setProperty(PANEL_ALIGN_INLINE_VAR, `${dodge.alignInline}px`);
      if (dodge.width === TOAST_WIDTH) root.style.removeProperty(TOAST_WIDTH_VAR);
      else root.style.setProperty(TOAST_WIDTH_VAR, `${dodge.width}px`);
    };

    const observer = new ResizeObserver(apply);
    observer.observe(panel);
    window.addEventListener('resize', apply);
    apply();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', apply);
      clear();
    };
  }, []);

  return <span aria-hidden hidden ref={probeRef} />;
};
