'use client';

import { useAppElement } from '@/ThemeProvider';

export const usePopoverPortalContainer = (
  root?: HTMLElement | ShadowRoot | null,
): HTMLElement | null => {
  const appElement = useAppElement();
  if (typeof document === 'undefined') return null;
  return (root as HTMLElement | null) ?? appElement ?? document.body;
};
