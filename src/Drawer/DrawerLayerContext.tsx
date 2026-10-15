'use client';

import { createContext, use } from 'react';

export interface DrawerLayer {
  popupRef: (node: HTMLElement | null) => void;
  zIndex: number | undefined;
}

const DrawerLayerContext = createContext<DrawerLayer | null>(null);

export const useDrawerLayer = () => use(DrawerLayerContext);
export const DrawerLayerProvider = DrawerLayerContext.Provider;
