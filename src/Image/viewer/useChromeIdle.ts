'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const IDLE_HIDE_MS = 2000;

export interface UseChromeIdleResult {
  hidden: boolean;
  ref: (node: HTMLDivElement | null) => void;
  setHeld: (held: boolean) => void;
}

export const useChromeIdle = (): UseChromeIdleResult => {
  const [hidden, setHidden] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const overChromeRef = useRef(false);
  const heldRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const arm = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(function fire() {
      timerRef.current = null;
      const node = nodeRef.current;
      const active = document.activeElement;
      const focusWithin = Boolean(node && active && node.contains(active));
      if (overChromeRef.current || heldRef.current || focusWithin) {
        timerRef.current = window.setTimeout(fire, IDLE_HIDE_MS);
        return;
      }
      setHidden(true);
    }, IDLE_HIDE_MS);
  }, [clearTimer]);

  const wake = useCallback(() => {
    setHidden(false);
    arm();
  }, [arm]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      overChromeRef.current = Boolean(
        event.target instanceof Node && nodeRef.current?.contains(event.target),
      );
      wake();
    };
    const handleActivity = () => wake();

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerdown', handleActivity);
    document.addEventListener('wheel', handleActivity, { passive: true });
    document.addEventListener('keydown', handleActivity);
    arm();

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handleActivity);
      document.removeEventListener('wheel', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      clearTimer();
    };
  }, [arm, clearTimer, wake]);

  const setHeld = useCallback(
    (held: boolean) => {
      heldRef.current = held;
      if (held) wake();
    },
    [wake],
  );

  const ref = useCallback((node: HTMLDivElement | null) => {
    nodeRef.current = node;
  }, []);

  return { hidden, ref, setHeld };
};
