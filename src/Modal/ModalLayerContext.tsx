'use client';

import { createContext, use } from 'react';

export interface ModalLayer {
  popupRef: (node: HTMLElement | null) => void;
  zIndex: number | undefined;
}

const ModalLayerContext = createContext<ModalLayer | null>(null);

export const useModalLayer = () => use(ModalLayerContext);
export const ModalLayerProvider = ModalLayerContext.Provider;
