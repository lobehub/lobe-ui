'use client';

import { createContext, memo, type ReactNode, use } from 'react';

export type PopoverContextValue = {
  close: () => void;
};

const noop =
  process.env.NODE_ENV === 'production'
    ? () => void 0
    : () => {
        throw new Error('usePopoverContext must be used within a PopoverProvider');
      };

export const PopoverContext = createContext<PopoverContextValue>({
  close: noop,
});

export const PopoverProvider = memo<{ children: ReactNode; value: PopoverContextValue }>(
  ({ children, value }) => {
    return <PopoverContext value={value}>{children}</PopoverContext>;
  },
);

export const usePopoverContext = () => {
  return use(PopoverContext);
};
