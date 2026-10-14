import { useSyncExternalStore } from 'react';

const MAX_RECENT = 9;

let recentColors: string[] = [];
const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

export const pushRecentColor = (hex: string) => {
  const key = hex.toLowerCase();
  recentColors = [key, ...recentColors.filter((color) => color !== key)].slice(0, MAX_RECENT);
  emit();
};

export const clearRecentColors = () => {
  recentColors = [];
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => recentColors;

export const useRecentColors = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
