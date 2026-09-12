import { globalFocusRingCSS } from './style';

const installations = new WeakMap<Document, { dispose: () => void; users: number }>();

/** Install once per document. The returned cleanup is safe for nested providers and Strict Mode. */
export const installGlobalFocusRing = (doc: Document = document): (() => void) => {
  const existing = installations.get(doc);
  if (existing) {
    existing.users += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      if (--existing.users === 0) existing.dispose();
    };
  }

  const win = doc.defaultView;
  if (
    !win ||
    !doc.body ||
    !win.CSS?.supports('top', 'anchor(top)') ||
    !win.CSS.supports('position-visibility', 'anchors-visible') ||
    !('showPopover' in doc.createElement('div'))
  )
    return () => {};

  const sheet = doc.createElement('style');
  sheet.textContent = globalFocusRingCSS;
  const ring = doc.createElement('div');
  ring.setAttribute('data-lobe-global-focus-ring', '');
  ring.setAttribute('aria-hidden', 'true');
  ring.setAttribute('popover', 'manual');
  doc.head.append(sheet);
  doc.body.append(ring);

  let target: HTMLElement | undefined;
  let restoreTarget: (() => void) | undefined;
  let frame = 0;
  let disposed = false;

  const clear = () => {
    if (ring.matches(':popover-open')) ring.hidePopover();
    restoreTarget?.();
    restoreTarget = undefined;
    target = undefined;
  };

  const sync = () => {
    if (disposed) return;
    const next = doc.activeElement;
    if (next === target && next?.matches(':focus-visible') && next.isConnected) return;
    clear();
    // Shadow roots and fragmented inline text retain their own focus treatment.
    if (
      !next ||
      next === doc.body ||
      next.namespaceURI !== 'http://www.w3.org/1999/xhtml' ||
      next.shadowRoot ||
      next.closest('[data-lobe-focus-ring="off"]') ||
      next.matches('textarea') ||
      (next as HTMLElement).isContentEditable ||
      (next.matches('input') &&
        ![
          'button',
          'submit',
          'reset',
          'image',
          'checkbox',
          'radio',
          'range',
          'color',
          'file',
        ].includes((next as HTMLInputElement).type)) ||
      !next.matches(':focus-visible') ||
      next.getClientRects().length !== 1
    )
      return;

    const element = next as HTMLElement;
    const computed = win.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height || computed.visibility !== 'visible') return;

    const saved = ['anchor-name', 'outline'].map((property) => ({
      priority: element.style.getPropertyPriority(property),
      property,
      value: element.style.getPropertyValue(property),
    }));
    const oldMarker = element.getAttribute('data-lobe-focus-ring');
    const anchor = computed.getPropertyValue('anchor-name').trim();
    const assignedAnchor =
      anchor && anchor !== 'none' ? `${anchor}, --lobe-global-focus` : '--lobe-global-focus';
    element.style.setProperty('anchor-name', assignedAnchor, 'important');
    ring.style.borderRadius = computed.borderRadius;
    ring.style.setProperty(
      '--lobe-focus-ring-color',
      computed.getPropertyValue('--lobe-focus-ring-color').trim() ||
        computed.getPropertyValue('--ant-color-info').trim() ||
        '#1677ff',
    );

    restoreTarget = () => {
      for (const { property, value, priority } of saved) {
        const assigned = property === 'anchor-name' ? assignedAnchor : 'none';
        if (element.style.getPropertyValue(property) !== assigned) continue;
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      }
      if (element.getAttribute('data-lobe-focus-ring') === 'managed') {
        if (oldMarker === null) element.removeAttribute('data-lobe-focus-ring');
        else element.setAttribute('data-lobe-focus-ring', oldMarker);
      }
    };
    try {
      ring.showPopover();
      // Do not suppress a working native outline when an anchor cannot resolve.
      const bounds = ring.getBoundingClientRect();
      if (
        Math.max(
          ...(['top', 'right', 'bottom', 'left'] as const).map((edge) =>
            Math.abs(bounds[edge] - rect[edge]),
          ),
        ) > 1
      ) {
        clear();
        return;
      }
      element.style.setProperty('outline', 'none', 'important');
      element.setAttribute('data-lobe-focus-ring', 'managed');
      target = element;
    } catch {
      clear();
    }
  };

  const schedule = () => {
    if (!frame)
      frame = win.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
  };
  const blur = () => {
    win.cancelAnimationFrame(frame);
    frame = 0;
    clear();
  };
  const observer = new MutationObserver(() => {
    if (target && !target.isConnected) clear();
  });
  observer.observe(doc.body, { childList: true, subtree: true });
  doc.addEventListener('focusin', sync, true);
  doc.addEventListener('focusout', schedule, true);
  doc.addEventListener('keydown', schedule, true);
  doc.addEventListener('pointerdown', schedule, true);
  win.addEventListener('blur', blur);
  win.addEventListener('focus', schedule);

  const installation = {
    dispose: () => {
      disposed = true;
      win.cancelAnimationFrame(frame);
      observer.disconnect();
      doc.removeEventListener('focusin', sync, true);
      doc.removeEventListener('focusout', schedule, true);
      doc.removeEventListener('keydown', schedule, true);
      doc.removeEventListener('pointerdown', schedule, true);
      win.removeEventListener('blur', blur);
      win.removeEventListener('focus', schedule);
      clear();
      ring.remove();
      sheet.remove();
      installations.delete(doc);
    },
    users: 0,
  };
  installations.set(doc, installation);
  sync();
  return installGlobalFocusRing(doc);
};
