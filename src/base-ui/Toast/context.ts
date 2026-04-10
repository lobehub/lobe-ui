'use client';

import { createContext, useContext } from 'react';

import type { ToastPosition } from './type';

export interface ToastContextValue {
  position: ToastPosition;
  swipeDirection: ('left' | 'right' | 'up' | 'down') | ('left' | 'right' | 'up' | 'down')[];
}

export const ToastContext = createContext<ToastContextValue>({
  position: 'bottom-right',
  swipeDirection: ['down', 'right'],
});

export const useToastContext = () => useContext(ToastContext);
