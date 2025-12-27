'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import ThemeProvider from '@/ThemeProvider';

type TooltipPortalProps = {
  children: ReactNode;
  root?: HTMLElement | ShadowRoot | null;
};

const PORTAL_ATTR = 'data-lobe-ui-tooltip-portal';

// Reuse one portal container per root (document.body by default).
const containerMap = new WeakMap<object, HTMLElement>();

const getOrCreateContainer = (root: HTMLElement | ShadowRoot): HTMLElement => {
  const cached = containerMap.get(root);
  if (cached && cached.isConnected) return cached;

  const el = document.createElement('div');
  el.setAttribute(PORTAL_ATTR, 'true');
  root.append(el);
  containerMap.set(root, el);
  return el;
};

const resolveRoot = (root?: HTMLElement | ShadowRoot | null): HTMLElement | ShadowRoot | null => {
  if (root) return root;
  if (typeof document === 'undefined') return null;
  return document.body;
};

const TooltipPortal = ({ children, root }: TooltipPortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(() => {
    const resolved = resolveRoot(root);
    if (!resolved) return null;
    return getOrCreateContainer(resolved);
  });

  if (!container && typeof document !== 'undefined') {
    setContainer(getOrCreateContainer(document.body));
  }

  if (!container) return null;
  return createPortal(<ThemeProvider>{children}</ThemeProvider>, container);
};

export default TooltipPortal;
