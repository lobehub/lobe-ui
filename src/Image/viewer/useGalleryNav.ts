import type { MotionValue } from 'motion/react';
import { useCallback, useRef } from 'react';

import type { Size } from './geometry';
import type { PreviewEntry } from './registry';

export const readNatural = (element: HTMLImageElement): Size => {
  if (element.naturalWidth > 0 && element.naturalHeight > 0)
    return { height: element.naturalHeight, width: element.naturalWidth };
  const rect = element.getBoundingClientRect();
  return { height: Math.max(rect.height, 1), width: Math.max(rect.width, 1) };
};

export interface UseGalleryNavOptions {
  currentIndex: number;
  entries: PreviewEntry[];
  flipX: MotionValue<boolean>;
  flipY: MotionValue<boolean>;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  setCurrentIndex: (index: number) => void;
  setNatural: (natural: Size) => void;
  setSource: (src: string) => void;
  switchTo: (apply: () => void) => void;
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
  currentIndex,
  entries,
  flipX,
  flipY,
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

  const goTo = useCallback(
    (nextIndex: number) => {
      if (switchingRef.current) return;
      if (nextIndex < 0 || nextIndex >= entries.length || nextIndex === indexRef.current) return;
      switchingRef.current = true;
      switchToRef.current(() => {
        const nextEntry = entries[nextIndex];
        setCurrentIndex(nextIndex);
        setSource(nextEntry.src);
        const nextNatural = readNatural(nextEntry.element);
        setNatural(nextNatural);
        syncZoomNatural(nextNatural);
        scale.set(1);
        x.set(0);
        y.set(0);
        rotate.set(0);
        flipX.set(false);
        flipY.set(false);
        switchingRef.current = false;
      });
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

  return {
    hasNext: currentIndex < entries.length - 1,
    hasPrev: currentIndex > 0,
    next,
    prev,
  };
};
