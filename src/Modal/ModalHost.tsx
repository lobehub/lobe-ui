'use client';

import { useEffect, useSyncExternalStore } from 'react';

import { useIsClient } from '@/hooks/useIsClient';
import { registerDevSingleton } from '@/utils/devSingleton';

import { ModalPortal } from './ModalPortal';
import { ModalStack } from './ModalStack';
import type { ModalHostProps } from './stackTypes';
import { getServerSnapshot, getSnapshot, subscribe } from './store';

export const ModalHost = ({ root }: ModalHostProps) => {
  const stack = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    // Enforce singleton per portal root (dev-only).
    const scope = root ?? document.body;
    return registerDevSingleton('ModalHost', scope);
  }, [isClient, root]);

  if (!isClient) return null;
  if (stack.length === 0) return null;

  return (
    <ModalPortal root={root}>
      <ModalStack stack={stack} />
    </ModalPortal>
  );
};
