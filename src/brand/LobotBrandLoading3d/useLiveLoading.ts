'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { LobotLoadingLayers } from './live';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type LiveModule = typeof import('./live');

let liveModule: LiveModule | undefined;
let warmed = false;

/**
 * Runs the animated loader. Returns whether the painter owns the layers; until the engine is
 * loaded (and whenever `enabled` is off) React renders the still mark into them.
 */
export const useLiveLoading = (enabled: boolean, idPrefix: string) => {
  const [ready, setReady] = useState(false);
  const live = enabled && ready;
  const body = useRef<SVGGElement>(null);
  const bubbles = useRef<SVGGElement>(null);
  const defs = useRef<SVGDefsElement>(null);
  const eyes = useRef<SVGGElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }
    if (warmed) {
      setReady(true);
      return;
    }
    let cancelled = false;
    // An engine that fails to load leaves the loader on its still mark.
    void import('./live')
      .then((module) => {
        if (cancelled) return;
        liveModule = module;
        module.warm();
        warmed = true;
        setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useIsomorphicLayoutEffect(() => {
    if (!live || !liveModule) return;
    return liveModule.runLobotLoading(
      {
        body: body.current,
        bubbles: bubbles.current,
        defs: defs.current,
        eyes: eyes.current,
      } as LobotLoadingLayers,
      idPrefix,
    );
  }, [live, idPrefix]);

  return { body, bubbles, defs, eyes, live };
};
