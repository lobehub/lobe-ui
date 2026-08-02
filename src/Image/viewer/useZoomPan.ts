import type { MotionValue } from 'motion/react';
import { animate, motionValue } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Point, Rect, Rotation, Size, TransformState } from './geometry';
import {
  anchoredZoom,
  clampPan,
  clampScale,
  computeFit,
  DEFAULT_MAX_SCALE,
  doubleClickTarget,
  normalizeRotation,
  panBounds,
  rubberBand,
  wheelZoomFactor,
} from './geometry';

const WHEEL_CLOSE_THRESHOLD = 100;
const WHEEL_IDLE_MS = 300;
const ZOOM_STEP = 1.5;
const RESET_TRANSITION = { damping: 30, stiffness: 300, type: 'spring' as const };
const CLEAN_EPSILON = 0.01;

export interface WheelLikeEvent {
  clientX: number;
  clientY: number;
  ctrlKey?: boolean;
  deltaY: number;
  metaKey?: boolean;
  preventDefault?: () => void;
}

export interface UseZoomPanOptions {
  isClosing?: () => boolean;
  maxScale?: number;
  natural: Size;
  onCloseRequest?: () => void;
  viewport: Size;
}

export interface UseZoomPanResult {
  canZoomIn: boolean;
  canZoomOut: boolean;
  dragBy: (delta: Point) => void;
  dragEnd: () => void;
  escIntent: () => 'reset' | 'close';
  flipHorizontal: () => void;
  flipVertical: () => void;
  flipX: MotionValue<boolean>;
  flipY: MotionValue<boolean>;
  handleDoubleClick: (point: Point) => void;
  handleWheel: (event: WheelLikeEvent) => void;
  isClean: boolean;
  isZoomed: boolean;
  reset: () => void;
  resetCloseTracking: () => void;
  rotate: MotionValue<number>;
  rotateLeft: () => void;
  rotateRight: () => void;
  rotation: Rotation;
  scale: MotionValue<number>;
  setNatural: (natural: Size) => void;
  setViewport: (viewport: Size) => void;
  x: MotionValue<number>;
  y: MotionValue<number>;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface DerivedState {
  canZoomIn: boolean;
  canZoomOut: boolean;
  isClean: boolean;
  isZoomed: boolean;
  rotation: Rotation;
}

export const useZoomPan = ({
  natural,
  viewport,
  maxScale,
  onCloseRequest,
  isClosing,
}: UseZoomPanOptions): UseZoomPanResult => {
  const [{ scale, x, y, rotate, flipX, flipY }] = useState(() => ({
    flipX: motionValue(false),
    flipY: motionValue(false),
    rotate: motionValue(0),
    scale: motionValue(1),
    x: motionValue(0),
    y: motionValue(0),
  }));

  const naturalRef = useRef(natural);
  const viewportRef = useRef(viewport);
  const maxScaleRef = useRef(maxScale ?? DEFAULT_MAX_SCALE);
  maxScaleRef.current = maxScale ?? DEFAULT_MAX_SCALE;

  const onCloseRequestRef = useRef(onCloseRequest);
  onCloseRequestRef.current = onCloseRequest;

  const isClosingRef = useRef(isClosing);
  isClosingRef.current = isClosing;

  const closeAccumRef = useRef(0);
  const disarmedRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetCloseTracking = useCallback(() => {
    if (idleTimerRef.current !== null) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    closeAccumRef.current = 0;
    disarmedRef.current = false;
  }, []);

  // The close FLIP spring animates these same scale/x/y values. Any of
  // these entry points still firing during the ~300ms close window would
  // either fight that spring visually or, for wheel/reset specifically,
  // race escIntent()/isCleanState() into cancelling the close outright.
  const closing = useCallback(() => isClosingRef.current?.() ?? false, []);

  const isCleanState = useCallback(
    () =>
      Math.abs(scale.get() - 1) < CLEAN_EPSILON &&
      Math.abs(rotate.get()) < CLEAN_EPSILON &&
      !flipX.get() &&
      !flipY.get(),
    [flipX, flipY, rotate, scale],
  );

  const computeDerived = useCallback((): DerivedState => {
    const currentScale = scale.get();
    return {
      canZoomIn: currentScale < maxScaleRef.current,
      canZoomOut: currentScale > 1,
      isClean: isCleanState(),
      isZoomed: currentScale > 1,
      rotation: normalizeRotation(rotate.get()),
    };
  }, [isCleanState, rotate, scale]);

  const [derived, setDerived] = useState<DerivedState>(computeDerived);

  const syncDerived = useCallback(() => {
    setDerived((prev) => {
      const next = computeDerived();
      if (
        prev.canZoomIn === next.canZoomIn &&
        prev.canZoomOut === next.canZoomOut &&
        prev.isClean === next.isClean &&
        prev.isZoomed === next.isZoomed &&
        prev.rotation === next.rotation
      ) {
        return prev;
      }
      return next;
    });
  }, [computeDerived]);

  useEffect(() => {
    const unsubscribers = [scale, rotate, flipX, flipY].map((value) =>
      value.on('change', syncDerived),
    );
    syncDerived();
    return () => {
      for (const unsubscribe of unsubscribers) unsubscribe();
    };
  }, [flipX, flipY, rotate, scale, syncDerived]);

  const getFitRect = useCallback(
    () => computeFit(naturalRef.current, viewportRef.current, normalizeRotation(rotate.get())),
    [rotate],
  );

  const applyTransform = useCallback(
    (next: TransformState, fitRect: Rect) => {
      const clamped = clampPan(next, fitRect, viewportRef.current);
      // .jump(), not .set(): a surviving spring on these same values (e.g. a
      // dragEnd clamp-back or wheel snap-back still in flight) would otherwise
      // keep animating toward its own target and silently overwrite this
      // instant write on its next tick — motion's set() never stops an
      // active animation, only jump() does.
      scale.jump(next.scale);
      x.jump(clamped.x);
      y.jump(clamped.y);
    },
    [scale, x, y],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      if (closing()) return;
      const currentScale = scale.get();
      const targetScale = clampScale(currentScale * factor, maxScaleRef.current);
      const fitRect = getFitRect();
      const anchor: Point = { x: viewportRef.current.width / 2, y: viewportRef.current.height / 2 };
      const next = anchoredZoom(
        { scale: currentScale, x: x.get(), y: y.get() },
        targetScale,
        anchor,
        fitRect,
      );
      applyTransform(next, fitRect);
    },
    [applyTransform, closing, getFitRect, scale, x, y],
  );

  const zoomIn = useCallback(() => zoomBy(ZOOM_STEP), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(1 / ZOOM_STEP), [zoomBy]);

  const handleDoubleClick = useCallback(
    (point: Point) => {
      const currentScale = scale.get();
      const fitRect = getFitRect();
      const target = doubleClickTarget(
        currentScale,
        naturalRef.current,
        fitRect,
        normalizeRotation(rotate.get()),
      );
      const targetScale = clampScale(target, maxScaleRef.current);
      const next = anchoredZoom(
        { scale: currentScale, x: x.get(), y: y.get() },
        targetScale,
        point,
        fitRect,
      );
      applyTransform(next, fitRect);
    },
    [applyTransform, getFitRect, rotate, scale, x, y],
  );

  const handleWheel = useCallback(
    (event: WheelLikeEvent) => {
      event.preventDefault?.();
      if (closing()) return;

      if (idleTimerRef.current !== null) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        idleTimerRef.current = null;
        closeAccumRef.current = 0;
        disarmedRef.current = false;
      }, WHEEL_IDLE_MS);

      const currentScale = scale.get();
      const isPinch = !!(event.ctrlKey || event.metaKey);
      const zoomed = currentScale > 1;

      if (isPinch || zoomed) {
        disarmedRef.current = true;
        closeAccumRef.current = 0;

        const rawTarget = currentScale * wheelZoomFactor(event.deltaY);

        if (rawTarget <= 1) {
          animate(scale, 1, RESET_TRANSITION);
          animate(x, 0, RESET_TRANSITION);
          animate(y, 0, RESET_TRANSITION);
          return;
        }

        const targetScale = clampScale(rawTarget, maxScaleRef.current);
        const fitRect = getFitRect();
        const anchor: Point = { x: event.clientX, y: event.clientY };
        const next = anchoredZoom(
          { scale: currentScale, x: x.get(), y: y.get() },
          targetScale,
          anchor,
          fitRect,
        );
        applyTransform(next, fitRect);
        return;
      }

      if (disarmedRef.current || !isCleanState()) return;

      closeAccumRef.current += Math.abs(event.deltaY);
      if (closeAccumRef.current >= WHEEL_CLOSE_THRESHOLD) {
        closeAccumRef.current = 0;
        onCloseRequestRef.current?.();
      }
    },
    [applyTransform, closing, getFitRect, isCleanState, scale, x, y],
  );

  const rotateBy = useCallback(
    (delta: 90 | -90) => {
      if (closing()) return;
      rotate.jump(normalizeRotation(rotate.get() + delta));
      scale.jump(1);
      x.jump(0);
      y.jump(0);
    },
    [closing, rotate, scale, x, y],
  );

  const rotateLeft = useCallback(() => rotateBy(-90), [rotateBy]);
  const rotateRight = useCallback(() => rotateBy(90), [rotateBy]);

  const flipHorizontal = useCallback(() => {
    if (closing()) return;
    flipX.set(!flipX.get());
  }, [closing, flipX]);

  const flipVertical = useCallback(() => {
    if (closing()) return;
    flipY.set(!flipY.get());
  }, [closing, flipY]);

  const reset = useCallback(() => {
    if (closing()) return;
    animate(scale, 1, RESET_TRANSITION);
    animate(x, 0, RESET_TRANSITION);
    animate(y, 0, RESET_TRANSITION);
    animate(rotate, 0, RESET_TRANSITION);
    flipX.set(false);
    flipY.set(false);
  }, [closing, flipX, flipY, rotate, scale, x, y]);

  const dragBy = useCallback(
    (delta: Point) => {
      const fitRect = getFitRect();
      const bounds = panBounds({ scale: scale.get(), x: 0, y: 0 }, fitRect, viewportRef.current);
      x.set(rubberBand(x.get() + delta.x, bounds.x.min, bounds.x.max));
      y.set(rubberBand(y.get() + delta.y, bounds.y.min, bounds.y.max));
    },
    [getFitRect, scale, x, y],
  );

  const dragEnd = useCallback(() => {
    const fitRect = getFitRect();
    const clamped = clampPan(
      { scale: scale.get(), x: x.get(), y: y.get() },
      fitRect,
      viewportRef.current,
    );
    animate(x, clamped.x, RESET_TRANSITION);
    animate(y, clamped.y, RESET_TRANSITION);
  }, [getFitRect, scale, x, y]);

  const escIntent = useCallback(
    (): 'reset' | 'close' => (isCleanState() ? 'close' : 'reset'),
    [isCleanState],
  );

  const setViewport = useCallback(
    (next: Size) => {
      viewportRef.current = next;
      const fitRect = computeFit(naturalRef.current, next, normalizeRotation(rotate.get()));
      const clamped = clampPan({ scale: scale.get(), x: x.get(), y: y.get() }, fitRect, next);
      x.set(clamped.x);
      y.set(clamped.y);
    },
    [rotate, scale, x, y],
  );

  const setNatural = useCallback(
    (next: Size) => {
      naturalRef.current = next;
      const fitRect = computeFit(next, viewportRef.current, normalizeRotation(rotate.get()));
      const clamped = clampPan(
        { scale: scale.get(), x: x.get(), y: y.get() },
        fitRect,
        viewportRef.current,
      );
      x.set(clamped.x);
      y.set(clamped.y);
    },
    [rotate, scale, x, y],
  );

  return {
    canZoomIn: derived.canZoomIn,
    canZoomOut: derived.canZoomOut,
    dragBy,
    dragEnd,
    escIntent,
    flipHorizontal,
    flipVertical,
    flipX,
    flipY,
    handleDoubleClick,
    handleWheel,
    isClean: derived.isClean,
    isZoomed: derived.isZoomed,
    reset,
    resetCloseTracking,
    rotate,
    rotateLeft,
    rotateRight,
    rotation: derived.rotation,
    scale,
    setNatural,
    setViewport,
    x,
    y,
    zoomIn,
    zoomOut,
  };
};

export type { Point, Rotation, Size } from './geometry';
