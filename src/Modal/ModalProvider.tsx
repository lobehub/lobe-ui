'use client';

import type { ReactNode } from 'react';
import { createContext, memo, use } from 'react';

import type { ModalContextValue } from './type';

export const ModalContext = createContext<ModalContextValue>({
  close: () => undefined,
  setCanDismissByClickOutside: () => undefined,
});

export const ModalProvider = memo<{ children: ReactNode; value: ModalContextValue }>(
  ({ children, value }) => {
    return <ModalContext value={value}>{children}</ModalContext>;
  },
);

export const useModalContext = () => {
  return use(ModalContext);
};
