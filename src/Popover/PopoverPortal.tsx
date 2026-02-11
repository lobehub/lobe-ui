'use client';

import { useEffect, useState } from 'react';

import { useAppElement } from '@/ThemeProvider';

const PORTAL_ATTR = 'data-lobe-ui-popover-portal';
export const POPOVER_CONTAINER_ATTR = 'data-lobe-ui-popover-container';

// Reuse one portal container per root (document.body by default).
const containerMap = new WeakMap<object, HTMLElement>();

const getOrCreateContainer = (root: HTMLElement | ShadowRoot): HTMLElement => {
  const resolvedRoot = (() => {
    if (typeof document === 'undefined') return root;
    if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) return root;

    return root;
  })();

  const cached = containerMap.get(resolvedRoot);
  if (cached && cached.isConnected) return cached;

  const el = document.createElement('div');
  el.setAttribute(PORTAL_ATTR, 'true');
  resolvedRoot.append(el);
  containerMap.set(resolvedRoot, el);
  return el;
};

export const usePopoverPortalContainer = (
  root?: HTMLElement | ShadowRoot | null,
): HTMLElement | null => {
  const appElement = useAppElement();
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // Never mutate DOM / create portal container during render.
  // Create it after mount to avoid SSR/hydration side effects.
  useEffect(() => {
    const resolved = root ?? appElement ?? document.body;
    if (!resolved) return;
    setContainer(getOrCreateContainer(resolved));
  }, [root, appElement, container?.isConnected]);

  return container;
};
