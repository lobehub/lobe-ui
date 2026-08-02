import type { MotionValue } from 'motion/react';
import { animate, motionValue } from 'motion/react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { Rect } from './geometry';

export const OPEN_SPRING = { bounce: 0.15, type: 'spring' as const, visualDuration: 0.3 };
const FADE = { duration: 0.15, ease: 'easeOut' as const };
const CHROME_FADE = { delay: 0.15, duration: 0.2, ease: 'easeOut' as const };
const FADE_SCALE = 0.92;
const SWITCH_FADE_SCALE = 0.96;
const SETTLE_FALLBACK_MS = 1000;

interface Animation {
  stop: () => void;
}

export interface FlipTransformValues {
  flipX: MotionValue<boolean>;
  flipY: MotionValue<boolean>;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export interface UseFlipTransitionOptions {
  animated: boolean;
  getCloseSource: () => HTMLImageElement;
  getFitRect: () => Rect;
  onClosed: () => void;
  source: HTMLImageElement;
  transform: FlipTransformValues;
}

export interface CloseTransitionOptions {
  fade?: boolean;
}

export interface UseFlipTransitionResult {
  backdropRef: (node: HTMLElement | null) => void;
  chromeRef: (node: HTMLElement | null) => void;
  close: (options?: CloseTransitionOptions) => void;
  imageRef: (node: HTMLImageElement | null) => void;
  isTransitioning: () => boolean;
  switchTo: (apply: () => void) => void;
}

const measureSource = (element: HTMLImageElement): DOMRect | null => {
  if (!element.isConnected) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  if (rect.bottom <= 0 || rect.right <= 0) return null;
  if (rect.top >= window.innerHeight || rect.left >= window.innerWidth) return null;
  return rect;
};

const sourceTransform = (rect: DOMRect, fit: Rect) => ({
  scale:
    fit.width > 0 && fit.height > 0
      ? Math.max(rect.width / fit.width, rect.height / fit.height)
      : 1,
  x: rect.left + rect.width / 2 - (fit.x + fit.width / 2),
  y: rect.top + rect.height / 2 - (fit.y + fit.height / 2),
});

const readTransform = (transform: FlipTransformValues) =>
  [
    `translate3d(${transform.x.get()}px, ${transform.y.get()}px, 0)`,
    `scale(${transform.scale.get()})`,
    `rotate(${transform.rotate.get()}deg)`,
    `scaleX(${transform.flipX.get() ? -1 : 1})`,
    `scaleY(${transform.flipY.get() ? -1 : 1})`,
  ].join(' ');

const useBoundNode = <T extends HTMLElement>(apply: (node: T) => void) => {
  const nodeRef = useRef<T | null>(null);
  const applyRef = useRef(apply);
  applyRef.current = apply;

  const setNode = useCallback((node: T | null) => {
    nodeRef.current = node;
    if (node) applyRef.current(node);
  }, []);

  const refresh = useCallback(() => {
    const node = nodeRef.current;
    if (node) applyRef.current(node);
  }, []);

  return useMemo(() => ({ refresh, setNode }), [refresh, setNode]);
};

export const useFlipTransition = ({
  animated,
  getCloseSource,
  getFitRect,
  onClosed,
  source,
  transform,
}: UseFlipTransitionOptions): UseFlipTransitionResult => {
  const [opacity] = useState(() => ({
    backdrop: motionValue(0),
    chrome: motionValue(0),
    image: motionValue(animated ? 1 : 0),
  }));

  const image = useBoundNode<HTMLImageElement>(
    useCallback(
      (node) => {
        node.style.transform = readTransform(transform);
        node.style.opacity = String(opacity.image.get());
      },
      [opacity, transform],
    ),
  );

  const backdrop = useBoundNode<HTMLElement>(
    useCallback(
      (node) => {
        node.style.opacity = String(opacity.backdrop.get());
      },
      [opacity],
    ),
  );

  const chrome = useBoundNode<HTMLElement>(
    useCallback(
      (node) => {
        node.style.opacity = String(opacity.chrome.get());
      },
      [opacity],
    ),
  );

  const runningRef = useRef<Animation[]>([]);
  const closingRef = useRef(false);
  const transitioningRef = useRef(true);

  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;

  const getFitRectRef = useRef(getFitRect);
  getFitRectRef.current = getFitRect;

  const getCloseSourceRef = useRef(getCloseSource);
  getCloseSourceRef.current = getCloseSource;

  const run = useCallback((animations: Animation[]) => {
    runningRef.current = [...runningRef.current, ...animations];
  }, []);

  const stopAll = useCallback(() => {
    for (const animation of runningRef.current) animation.stop();
    runningRef.current = [];
  }, []);

  const isTransitioning = useCallback(() => transitioningRef.current, []);

  // A future animate() call on one of these shared motion values (e.g. a refit
  // triggered by a natural-size change) silently cancels whichever animation is
  // already running on it — motion's animate() stops the prior one without ever
  // firing its onComplete. Track completion by count for the common case, but
  // always back it with a fallback timer so onSettled fires exactly once no
  // matter what: a cancelled axis can never leave this permanently unfired.
  const animateSettling = useCallback(
    (axes: [MotionValue<number>, number][], onSettled: () => void) => {
      let pending = axes.length;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        onSettled();
      };
      const onAxisComplete = () => {
        pending -= 1;
        if (pending === 0) finish();
      };
      run(
        axes.map(([value, target]) =>
          animate(value, target, { ...OPEN_SPRING, onComplete: onAxisComplete }),
        ),
      );
      window.setTimeout(finish, SETTLE_FALLBACK_MS);
    },
    [run],
  );

  useLayoutEffect(() => {
    const unsubscribes = [
      ...[
        transform.flipX,
        transform.flipY,
        transform.rotate,
        transform.scale,
        transform.x,
        transform.y,
        opacity.image,
      ].map((value) => value.on('change', image.refresh)),
      opacity.backdrop.on('change', backdrop.refresh),
      opacity.chrome.on('change', chrome.refresh),
    ];

    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe();
    };
  }, [backdrop, chrome, image, opacity, transform]);

  useLayoutEffect(() => {
    const rect = animated ? measureSource(source) : null;
    transitioningRef.current = true;
    const markSettled = () => {
      transitioningRef.current = false;
    };

    if (rect) {
      const start = sourceTransform(rect, getFitRectRef.current());
      transform.scale.set(start.scale);
      transform.x.set(start.x);
      transform.y.set(start.y);
      opacity.image.set(1);
      animateSettling(
        [
          [transform.scale, 1],
          [transform.x, 0],
          [transform.y, 0],
        ],
        markSettled,
      );
    } else {
      opacity.image.set(0);
      if (animated) transform.scale.set(FADE_SCALE);
      run([animate(opacity.image, 1, { ...FADE, onComplete: markSettled })]);
      if (animated) run([animate(transform.scale, 1, FADE)]);
      window.setTimeout(markSettled, SETTLE_FALLBACK_MS);
    }

    run([animate(opacity.backdrop, 1, FADE), animate(opacity.chrome, 1, CHROME_FADE)]);

    return () => {
      stopAll();
    };
  }, [animateSettling, animated, opacity, run, source, stopAll, transform]);

  const close = useCallback(
    (options?: CloseTransitionOptions) => {
      if (closingRef.current) return;
      closingRef.current = true;
      transitioningRef.current = true;
      stopAll();

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        transitioningRef.current = false;
        onClosedRef.current();
      };
      const rect = animated && !options?.fade ? measureSource(getCloseSourceRef.current()) : null;

      run([animate(opacity.backdrop, 0, FADE), animate(opacity.chrome, 0, FADE)]);

      if (rect) {
        const target = sourceTransform(rect, getFitRectRef.current());
        animateSettling(
          [
            [transform.x, target.x],
            [transform.y, target.y],
            [transform.scale, target.scale],
          ],
          finish,
        );
        return;
      }

      if (animated) run([animate(transform.scale, transform.scale.get() * FADE_SCALE, FADE)]);
      run([animate(opacity.image, 0, { ...FADE, onComplete: finish })]);
      window.setTimeout(finish, SETTLE_FALLBACK_MS);
    },
    [animateSettling, animated, opacity, run, stopAll, transform],
  );

  const switchTo = useCallback(
    (apply: () => void) => {
      if (closingRef.current) return;
      stopAll();
      transitioningRef.current = true;

      const markSettled = () => {
        transitioningRef.current = false;
      };

      const tasks: Animation[] = [];
      if (animated) tasks.push(animate(transform.scale, SWITCH_FADE_SCALE, FADE));
      tasks.push(
        animate(opacity.image, 0, {
          ...FADE,
          onComplete: () => {
            apply();
            run([animate(opacity.image, 1, { ...FADE, onComplete: markSettled })]);
          },
        }),
      );
      run(tasks);
      window.setTimeout(markSettled, SETTLE_FALLBACK_MS);
    },
    [animated, opacity, run, stopAll, transform],
  );

  return {
    backdropRef: backdrop.setNode,
    chromeRef: chrome.setNode,
    close,
    imageRef: image.setNode,
    isTransitioning,
    switchTo,
  };
};
