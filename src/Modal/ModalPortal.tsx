'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { getOrCreateContainer, resolveRoot } from './utils';

export type ModalPortalProps = {
  children: ReactNode;
  root?: HTMLElement | ShadowRoot | null;
};

export const ModalPortal = ({ children, root }: ModalPortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(() => {
    const resolved = resolveRoot(root);
    if (!resolved) return null;
    return getOrCreateContainer(resolved);
  });

  if (!container) {
    setContainer(getOrCreateContainer(document.body));
  }

  if (!container) return null;
  return createPortal(children, container);
};
