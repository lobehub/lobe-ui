import type { MotionValue } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';

import type { Size } from './geometry';
import type { PreviewEntry } from './registry';
import { isTypingTarget } from './useViewerGestures';

export const readNatural = (element: HTMLImageElement): Size => {
  if (element.naturalWidth > 0 && element.naturalHeight > 0)
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
  resetCloseTracking: () => void;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  setCurrentIndex: (index: number) => void;
  setNatural: (natural: Size) => void;
  setSource: (src: string) => void;
  switchTo: (apply: () => void, direction?: 1 | -1) => void;
  syncZoomNatural: (natural: Size) => void;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export interface UseGalleryNavResult {
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

  const switchingRef = useRef(false);

  const switchToRef = useRef(switchTo);
  switchToRef.current = switchTo;

  const cancelPendingCloseRef = useRef(cancelPendingClose);
  cancelPendingCloseRef.current = cancelPendingClose;

  const resetCloseTrackingRef = useRef(resetCloseTracking);
  resetCloseTrackingRef.current = resetCloseTracking;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (switchingRef.current) return;
      if (nextIndex < 0 || nextIndex >= entries.length || nextIndex === indexRef.current) return;
      switchingRef.current = true;
      // A switch changes the displayed image out from under any pending
      // click-to-close or wheel-close accumulation armed for the old image,
      // so both must clear at this single choke point every switch goes through.
      cancelPendingCloseRef.current();
      resetCloseTrackingRef.current();
      switchToRef.current(
        () => {
          const nextEntry = entries[nextIndex];
          setCurrentIndex(nextIndex);
          setSource(nextEntry.src);
          const nextNatural = readNatural(nextEntry.element);
          setNatural(nextNatural);
          syncZoomNatural(nextNatural);
          // .jump(), not .set(): a surviving spring from the outgoing image (a
          // dragEnd clamp-back, a wheel snap-back, or reset()) targets the OLD
          // image's bounds and would otherwise silently overwrite this reset on
          // its next tick, since motion's set() never stops an active animation.
          scale.jump(1);
          x.jump(0);
          y.jump(0);
          rotate.jump(0);
          flipX.jump(false);
          flipY.jump(false);
          switchingRef.current = false;
        },
        nextIndex > indexRef.current ? 1 : -1,
      );
    },
    [
      entries,
      flipX,
      flipY,
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

  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);
  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);

  const isGallery = entries.length > 1;

  useEffect(() => {
    if (!isGallery) return;
    const listener = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
      if (isTypingTarget(event.target)) return;
      if (event.key === 'ArrowLeft') prev();
      else if (event.key === 'ArrowRight') next();
      else return;
      event.preventDefault();
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [isGallery, next, prev]);

  return {
    hasNext: currentIndex < entries.length - 1,
    hasPrev: currentIndex > 0,
    next,
    prev,
  };
};
