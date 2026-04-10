'use client';

import { createContext, use } from 'react';

import type { ModalContextValue } from './type';

export const ModalContext = createContext<ModalContextValue>({
  close: () => undefined,
  setCanDismissByClickOutside: () => undefined,
});

export const useModalContext = () => use(ModalContext);
