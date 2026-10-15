'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const IDLE_HIDE_MS = 2000;

export const useControlsIdle = (forceVisible: boolean) => {
  const [active, setActive] = useState(false);
  const [focused, setFocused] = useState(false);
  const [held, setHeld] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const clear = useCallback(() => {
    if (timer.current === undefined) return;
    window.clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  const wake = useCallback(() => {
    setActive(true);
    clear();
    timer.current = window.setTimeout(() => {
      timer.current = undefined;
      setActive(false);
    }, IDLE_HIDE_MS);
  }, [clear]);

  const sleep = useCallback(() => {
    clear();
    setActive(false);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return {
    hold: setHeld,
    setFocused,
    sleep,
    visible: forceVisible || active || focused || held,
    wake,
  };
};
