'use client';

import { useMemo } from 'react';

import { LOBE_THEME_APP_ID } from '@/ThemeProvider';

import { useIsClient } from './useIsClient';

export const usePortalContainer = (containerAttr?: string): HTMLElement | null => {
  const isClient = useIsClient();

  return useMemo(() => {
    if (!isClient) return null;

    const themeApp = document.querySelector<HTMLElement>(`#${LOBE_THEME_APP_ID}`);
    if (themeApp) return themeApp;

    if (containerAttr) {
      const container = document.querySelector<HTMLElement>(`[${containerAttr}="true"]`);
      if (container) return container;
    }

    return document.body;
  }, [isClient, containerAttr]);
};
