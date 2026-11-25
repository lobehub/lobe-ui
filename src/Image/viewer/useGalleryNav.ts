import type { MotionValue } from 'motion/react';
import { type KeyboardEvent, useCallback, useRef } from 'react';

import type { Size } from './geometry';
import type { PreviewEntry } from './registry';
import { isTypingTarget } from './useViewerGestures';

const hasNaturalSize = (element: HTMLImageElement) =>
  element.naturalWidth > 0 && element.naturalHeight > 0;

export const readNatural = (element: HTMLImageElement): Size => {
  if (hasNaturalSize(element))
    return { height: element.naturalHeight, width: element.naturalWidth };
  const rect = element.getBoundingClientRect();
  return { height: Math.max(rect.height, 1), width: Math.max(rect.width, 1) };
};

export interface UseGalleryNavOptions {
  cancelPendingClose: () => void;
  currentIndex: number;
  entries: PreviewEntry[];
  flipX: MotionValue<boolean>;
  flipY: MotionValue<boolean>;
  getInitialScale: () => number;
  resetCloseTracking: () => void;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  setCurrentIndex: (index: number, snapFirstLoad: boolean) => void;
  setNatural: (natural: Size) => void;
  setSource: (src: string) => void;
  switchTo: (apply: () => void, direction?: 1 | -1 | 'instant') => void;
  syncZoomNatural: (natural: Size) => void;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export interface UseGalleryNavResult {
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  hasNext: boolean;
  hasPrev: boolean;
  next: () => void;
  prev: () => void;
}

export const useGalleryNav = ({
  cancelPendingClose,
  currentIndex,
  entries,
  flipX,
  flipY,
  getInitialScale,
  resetCloseTracking,
  rotate,
  scale,
  setCurrentIndex,
  setNatural,
  setSource,
  switchTo,
  syncZoomNatural,
  x,
  y,
}: UseGalleryNavOptions): UseGalleryNavResult => {
  const indexRef = useRef(currentIndex);
  indexRef.current = currentIndex;

  const pendingIndexRef = useRef<number | null>(null);

  const switchToRef = useRef(switchTo);
  switchToRef.current = switchTo;

  const cancelPendingCloseRef = useRef(cancelPendingClose);
  cancelPendingCloseRef.current = cancelPendingClose;

  const resetCloseTrackingRef = useRef(resetCloseTracking);
  resetCloseTrackingRef.current = resetCloseTracking;

  const step = useCallback(
    (direction: 1 | -1, instant = false) => {
      const pendingIndex = pendingIndexRef.current;
      if (pendingIndex !== null && !instant) return;
      // A fade commits its target at the end. Preserve the input order if a
      // keyboard switch takes over before that callback runs.
      const nextIndex = (pendingIndex ?? indexRef.current) + direction;
      if (nextIndex < 0 || nextIndex >= entries.length) return;
      pendingIndexRef.current = nextIndex;
      // A switch changes the displayed image out from under any pending
      // click-to-close or wheel-close accumulation armed for the old image,
      // so both must clear at this single choke point every switch goes through.
      cancelPendingCloseRef.current();
      resetCloseTrackingRef.current();
      switchToRef.current(
        () => {
          pendingIndexRef.current = null;
          if (nextIndex === indexRef.current) return;
          const nextEntry = entries[nextIndex];
          setCurrentIndex(nextIndex, instant && !hasNaturalSize(nextEntry.element));
          setSource(nextEntry.src);
          // Orientation first: syncZoomNatural derives the incoming image's
          // resting scale from the fit rect, which is rotation-dependent.
          rotate.jump(0);
          flipX.jump(false);
          flipY.jump(false);
          const nextNatural = readNatural(nextEntry.element);
          setNatural(nextNatural);
          syncZoomNatural(nextNatural);
          // .jump(), not .set(): a surviving spring from the outgoing image (a
          // dragEnd clamp-back, a wheel snap-back, or reset()) targets the OLD
          // image's bounds and would otherwise silently overwrite this reset on
          // its next tick, since motion's set() never stops an active animation.
          scale.jump(getInitialScale());
          x.jump(0);
          y.jump(0);
        },
        instant ? 'instant' : direction,
      );
    },
    [
      entries,
      flipX,
      flipY,
      getInitialScale,
      rotate,
      scale,
      setCurrentIndex,
      setNatural,
      setSource,
      syncZoomNatural,
      x,
      y,
    ],
  );

  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  const isGallery = entries.length > 1;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isGallery || event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented)
        return;
      const target = event.target;
      if (!(target instanceof Element) || !event.currentTarget.contains(target)) return;
      // More is portalled into the viewer, and focus can still be on its
      // trigger while the menu opens.
      if (
        isTypingTarget(target) ||
        target.closest('[role="menu"], [aria-haspopup="menu"][aria-expanded="true"]')
      )
        return;
      if (event.key === 'ArrowLeft') step(-1, true);
      else if (event.key === 'ArrowRight') step(1, true);
      else return;
      event.preventDefault();
    },
    [isGallery, step],
  );

  return {
    handleKeyDown,
    hasNext: currentIndex < entries.length - 1,
    hasPrev: currentIndex > 0,
    next,
    prev,
  };
};
