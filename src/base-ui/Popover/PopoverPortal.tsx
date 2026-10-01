'use client';

import { useAppElement } from '@/ThemeProvider/AppElementContext';

export const usePopoverPortalContainer = (
  root?: HTMLElement | ShadowRoot | null,
): HTMLElement | null => {
  const appElement = useAppElement();
  if (typeof document === 'undefined') return null;
  return (root as HTMLElement | null) ?? appElement ?? document.body;
};
