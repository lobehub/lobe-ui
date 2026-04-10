'use client';

import { createContext, use } from 'react';

const AppElementContext = createContext<HTMLDivElement | null>(null);

export const useAppElement = (): HTMLDivElement | null => {
  return use(AppElementContext);
};

export default AppElementContext;
