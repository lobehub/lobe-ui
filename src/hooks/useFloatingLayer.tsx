'use client';

import { createContext, useContext } from 'react';

/**
 * Context for managing floating layer stacking.
 * When a component like Popover opens, it can provide its container
 * so that nested floating elements (like Tooltip) can render into it,
 * avoiding z-index stacking context issues.
 */
export const FloatingLayerContext = createContext<HTMLElement | null>(null);

/**
 * Hook to get the current floating layer container.
 * Returns the nearest floating layer container from context, or null if none exists.
 */
export const useFloatingLayer = (): HTMLElement | null => {
  return useContext(FloatingLayerContext);
};

/**
 * Provider component for floating layer context.
 */
export const FloatingLayerProvider = FloatingLayerContext.Provider;
