'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';

export interface DrawerPushParent {
  pull: () => void;
  push: () => void;
}

const DrawerPushContext = createContext<DrawerPushParent | null>(null);

export const DrawerPushProvider = DrawerPushContext.Provider;

export const useDrawerPush = (open: boolean) => {
  const parent = use(DrawerPushContext);
  const [pushedCount, setPushedCount] = useState(0);

  const push = useCallback(() => setPushedCount((count) => count + 1), []);
  const pull = useCallback(() => setPushedCount((count) => Math.max(0, count - 1)), []);

  useEffect(() => {
    if (!open || !parent) return;
    parent.push();
    return () => parent.pull();
  }, [open, parent]);

  const childValue = useMemo<DrawerPushParent>(() => ({ pull, push }), [pull, push]);

  return { childValue, pushed: pushedCount > 0 };
};
