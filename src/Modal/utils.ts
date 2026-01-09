export const MODAL_PORTAL_ATTR = 'data-lobe-ui-modal-portal';

// Reuse one portal container per root (document.body by default).
const containerMap = new WeakMap<object, HTMLElement>();

export const getOrCreateContainer = (root: HTMLElement | ShadowRoot): HTMLElement => {
  const cached = containerMap.get(root);
  if (cached && cached.isConnected) return cached;

  const el = document.createElement('div');
  el.setAttribute(MODAL_PORTAL_ATTR, 'true');
  root.append(el);
  containerMap.set(root, el);
  return el;
};

export const resolveRoot = (
  root?: HTMLElement | ShadowRoot | null,
): HTMLElement | ShadowRoot | null => {
  if (root) return root;
  return document.body;
};
