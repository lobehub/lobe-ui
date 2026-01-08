'use client';

import { useEffect, useState } from 'react';

import { LOBE_THEME_APP_ID } from '@/ThemeProvider';

const PORTAL_ATTR = 'data-lobe-ui-tooltip-portal';
export const TOOLTIP_CONTAINER_ATTR = 'data-lobe-ui-tooltip-container';

// Reuse one portal container per root (document.body by default).
const containerMap = new WeakMap<object, HTMLElement>();

const getOrCreateContainer = (root: HTMLElement | ShadowRoot): HTMLElement => {
  const resolvedRoot = (() => {
    if (typeof document === 'undefined') return root;
    if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) return root;

    const isBody = root === document.body;
    if (!isBody) return root;

    const themeApp = document.querySelector<HTMLElement>(`#${LOBE_THEME_APP_ID}`);
    if (themeApp) return themeApp;

    const tooltipContainer = document.querySelector<HTMLElement>(
      `[${TOOLTIP_CONTAINER_ATTR}="true"]`,
    );
    if (tooltipContainer) return tooltipContainer;

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

const resolveRoot = (root?: HTMLElement | ShadowRoot | null): HTMLElement | ShadowRoot | null => {
  if (root) return root;
  return document.body;
};

export const useTooltipPortalContainer = (
  root?: HTMLElement | ShadowRoot | null,
): HTMLElement | null => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // Never mutate DOM / create portal container during render.
  // Create it after mount to avoid SSR/hydration side effects.
  useEffect(() => {
    const resolved = resolveRoot(root);
    if (!resolved) return;
    setContainer(getOrCreateContainer(resolved));
  }, [root]);

  return container;
};
