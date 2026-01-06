'use client';

import { type ReactNode, createContext, memo, use } from 'react';

export type PopoverContextValue = {
  close: () => void;
};

const noop = () => undefined;

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
