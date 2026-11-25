'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { LiveAvatarState } from './liveLoop';
import type { AgentAvatarLayers } from './painter';
import type { AgentAvatarShape } from './type';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type LiveModule = typeof import('./liveLoop');

let liveModule: LiveModule | undefined;
const loadLive = async () => (liveModule ??= await import('./liveLoop'));

/**
 * Shapes are built one per idle slot: a volume takes tens of milliseconds, and a list of avatars
 * must not turn that into one long task.
 */
const queue = new Set<() => Promise<void>>();
let pumping = false;

const nextSlot = () =>
  new Promise<void>((done) => {
    if (typeof requestIdleCallback === 'function')
      requestIdleCallback(() => done(), { timeout: 200 });
    else setTimeout(done, 16);
  });

const pump = async () => {
  if (pumping) return;
  pumping = true;
  while (queue.size > 0) {
    await nextSlot();
    const [task] = queue;
    if (!task) continue;
    queue.delete(task);
    // An engine that fails to load leaves the avatar on its still pose.
    await task().catch(() => {});
  }
  pumping = false;
};

export interface LiveAvatarOptions extends LiveAvatarState {
  enabled: boolean;
}

/**
 * Runs an animated avatar. Returns whether the painter owns the layers; until its shape is built
 * (and whenever `enabled` is off) React renders the still pose into them.
 */
export const useLiveAvatar = (options: LiveAvatarOptions) => {
  const { enabled, followPointer, shape, state } = options;
  const [readyShape, setReadyShape] = useState<AgentAvatarShape | null>(null);
  const live = enabled && readyShape === shape;
  const latest = useRef(options);
  const body = useRef<SVGGElement>(null);
  const defs = useRef<SVGDefsElement>(null);
  const eyes = useRef<SVGGElement>(null);

  useIsomorphicLayoutEffect(() => {
    latest.current = options;
  });

  useIsomorphicLayoutEffect(() => {
    if (!enabled) {
      setReadyShape(null);
      return;
    }
    if (liveModule?.isWarm(shape)) {
      setReadyShape(shape);
      return;
    }
    let cancelled = false;
    const task = async () => {
      const module = await loadLive();
      if (cancelled) return;
      module.warmShape(shape);
      setReadyShape(shape);
    };
    queue.add(task);
    void pump();
    return () => {
      cancelled = true;
      queue.delete(task);
    };
  }, [enabled, shape]);

  useIsomorphicLayoutEffect(() => {
    if (!live || !liveModule) return;
    return liveModule.runLiveAvatar(
      {
        body: body.current,
        defs: defs.current,
        eyes: eyes.current,
      } as AgentAvatarLayers,
      () => latest.current,
    );
  }, [live]);

  useEffect(() => {
    if (live) liveModule?.requestFrame();
  }, [live, state]);

  useEffect(() => {
    if (!live || !followPointer) return;
    return liveModule?.trackPointer();
  }, [followPointer, live]);

  return { body, defs, eyes, live };
};
