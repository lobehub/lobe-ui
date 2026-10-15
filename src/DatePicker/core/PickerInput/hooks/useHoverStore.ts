import * as React from 'react';

export type HoverSource = 'cell' | 'preset';

export interface HoverSnapshot<DateType> {
  source: HoverSource | null;
  value: DateType | null;
}

export interface HoverStore<DateType> {
  get: () => HoverSnapshot<DateType>;
  set: (value: DateType | null, source: HoverSource | null) => void;
  subscribe: (listener: () => void) => () => void;
}

const createHoverStore = <DateType>(): HoverStore<DateType> => {
  let snapshot: HoverSnapshot<DateType> = { source: null, value: null };
  const listeners = new Set<() => void>();
  return {
    get: () => snapshot,
    set: (value, source) => {
      if (snapshot.value === value && snapshot.source === source) return;
      snapshot = { source, value };
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export default function useHoverStore<DateType>() {
  const [store] = React.useState(createHoverStore<DateType>);
  return store;
}

export const useHoverSnapshot = <DateType>(store: HoverStore<DateType>) =>
  React.useSyncExternalStore(store.subscribe, store.get, store.get);
