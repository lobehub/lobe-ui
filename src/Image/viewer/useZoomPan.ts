import type { MotionValue } from 'motion/react';
import { animate, motionValue } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Point, Rect, Rotation, Size, TransformState, ZoomPolicy } from './geometry';
import {
  anchoredZoom,
  clampPan,
  clampScale,
  computeFit,
  DEFAULT_AUTO_ZOOM_THRESHOLD,
  DEFAULT_MAX_SCALE,
  doubleClickTarget,
  MIN_SCALE,
  naturalScale,
  normalizeRotation,
  normalizeWheelDelta,
  panBounds,
  resolveInitialScale,
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
  deltaMode?: number;
  deltaY: number;
  metaKey?: boolean;
  preventDefault?: () => void;
}

export interface UseZoomPanOptions {
  autoZoomThreshold?: number;
  defaultZoom?: ZoomPolicy;
  fillViewport?: boolean;
  isClosing?: () => boolean;
  isTransitioning?: () => boolean;
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
  getInitialScale: () => number;
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
  toggleActualSize: () => void;
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
  isTransitioning,
  fillViewport,
  defaultZoom,
  autoZoomThreshold,
}: UseZoomPanOptions): UseZoomPanResult => {
  const naturalRef = useRef(natural);
  const viewportRef = useRef(viewport);
  const maxScaleRef = useRef(maxScale ?? DEFAULT_MAX_SCALE);
  maxScaleRef.current = maxScale ?? DEFAULT_MAX_SCALE;
  const fillViewportRef = useRef(fillViewport ?? false);
  fillViewportRef.current = fillViewport ?? false;
  const policyRef = useRef(defaultZoom ?? 'auto');
  policyRef.current = defaultZoom ?? 'auto';
  const thresholdRef = useRef(autoZoomThreshold ?? DEFAULT_AUTO_ZOOM_THRESHOLD);
  thresholdRef.current = autoZoomThreshold ?? DEFAULT_AUTO_ZOOM_THRESHOLD;

  const computeInitialScale = useCallback((rotation: Rotation = 0) => {
    const fitRect = computeFit(
      naturalRef.current,
      viewportRef.current,
      rotation,
      fillViewportRef.current,
    );
    return resolveInitialScale(
      policyRef.current,
      naturalRef.current,
      fitRect,
      rotation,
      thresholdRef.current,
    );
  }, []);

  const [initialScaleSeed] = useState(computeInitialScale);
  const initialScaleRef = useRef(initialScaleSeed);
  const getInitialScale = useCallback(() => initialScaleRef.current, []);

  const [{ scale, x, y, rotate, flipX, flipY }] = useState(() => ({
    flipX: motionValue(false),
    flipY: motionValue(false),
    rotate: motionValue(0),
    scale: motionValue(initialScaleRef.current),
    x: motionValue(0),
    y: motionValue(0),
  }));

  // The ceiling has to clear the opening scale, otherwise a very large image
  // (naturalScale > maxScale) is clamped below the 100% it was asked to open at.
  const effectiveMaxScale = useCallback(
    () => Math.max(maxScaleRef.current, initialScaleRef.current),
    [],
  );

  const onCloseRequestRef = useRef(onCloseRequest);
  onCloseRequestRef.current = onCloseRequest;

  const isClosingRef = useRef(isClosing);
  isClosingRef.current = isClosing;

  const isTransitioningRef = useRef(isTransitioning);
  isTransitioningRef.current = isTransitioning;

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

  // Three questions that used to share one answer, and stop sharing it the
  // moment the viewer can open at something other than fit:
  //   isAtFitFloor       — no zoom-out left, so a further scroll down has
  //                        nowhere to go and becomes the dismiss gesture.
  //   isOrientationClean — no rotation/flip to lose, so dismissing is safe.
  //                        Guards the wheel the same way layered Esc does:
  //                        state the user built is never thrown away by a
  //                        gesture that merely ran out of room.
  //   isCleanState       — both of the above *and* untouched zoom, i.e. "the
  //                        user hasn't changed anything at all", which is what
  //                        lets Esc/click close outright and lets the close
  //                        animation FLIP back to the thumbnail instead of fade.
  // All three coincide only while initialScale === MIN_SCALE.
  const isAtFitFloor = useCallback(() => scale.get() <= MIN_SCALE + CLEAN_EPSILON, [scale]);

  const isOrientationClean = useCallback(
    () => Math.abs(rotate.get()) < CLEAN_EPSILON && !flipX.get() && !flipY.get(),
    [flipX, flipY, rotate],
  );

  const isCleanState = useCallback(
    () => Math.abs(scale.get() - initialScaleRef.current) < CLEAN_EPSILON && isOrientationClean(),
    [isOrientationClean, scale],
  );

  const computeDerived = useCallback((): DerivedState => {
    const currentScale = scale.get();
    return {
      canZoomIn: currentScale < effectiveMaxScale(),
      canZoomOut: currentScale > MIN_SCALE,
      isClean: isCleanState(),
      isZoomed: currentScale > MIN_SCALE,
      rotation: normalizeRotation(rotate.get()),
    };
  }, [effectiveMaxScale, isCleanState, rotate, scale]);

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
    () =>
      computeFit(
        naturalRef.current,
        viewportRef.current,
        normalizeRotation(rotate.get()),
        fillViewportRef.current,
      ),
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

  // Wheel/pinch stays on the instant applyTransform for 1:1 gesture tracking;
  // stepped inputs (toolbar/keyboard zoom, double-click) animate instead.
  const animateTransform = useCallback(
    (next: TransformState, fitRect: Rect) => {
      const clamped = clampPan(next, fitRect, viewportRef.current);
      animate(scale, next.scale, RESET_TRANSITION);
      animate(x, clamped.x, RESET_TRANSITION);
      animate(y, clamped.y, RESET_TRANSITION);
    },
    [scale, x, y],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      if (closing()) return;
      const currentScale = scale.get();
      const targetScale = clampScale(currentScale * factor, effectiveMaxScale());
      const fitRect = getFitRect();
      const anchor: Point = { x: viewportRef.current.width / 2, y: viewportRef.current.height / 2 };
      const next = anchoredZoom(
        { scale: currentScale, x: x.get(), y: y.get() },
        targetScale,
        anchor,
        fitRect,
      );
      animateTransform(next, fitRect);
    },
    [animateTransform, closing, effectiveMaxScale, getFitRect, scale, x, y],
  );

  const zoomIn = useCallback(() => zoomBy(ZOOM_STEP), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(1 / ZOOM_STEP), [zoomBy]);

  const handleDoubleClick = useCallback(
    (point: Point) => {
      if (closing()) return;
      const currentScale = scale.get();
      const fitRect = getFitRect();
      const target = doubleClickTarget(
        currentScale,
        naturalRef.current,
        fitRect,
        normalizeRotation(rotate.get()),
      );
      const targetScale = clampScale(target, effectiveMaxScale());
      const next = anchoredZoom(
        { scale: currentScale, x: x.get(), y: y.get() },
        targetScale,
        point,
        fitRect,
      );
      animateTransform(next, fitRect);
    },
    [animateTransform, closing, effectiveMaxScale, getFitRect, rotate, scale, x, y],
  );

  const toggleActualSize = useCallback(() => {
    if (closing()) return;
    const currentScale = scale.get();
    const fitRect = getFitRect();
    const actual = naturalScale(naturalRef.current, fitRect, normalizeRotation(rotate.get()));
    const atActual = Math.abs(currentScale - actual) < CLEAN_EPSILON;
    const targetScale = clampScale(atActual ? MIN_SCALE : actual, effectiveMaxScale());
    const anchor: Point = { x: viewportRef.current.width / 2, y: viewportRef.current.height / 2 };
    const next = anchoredZoom(
      { scale: currentScale, x: x.get(), y: y.get() },
      targetScale,
      anchor,
      fitRect,
    );
    animateTransform(next, fitRect);
  }, [animateTransform, closing, effectiveMaxScale, getFitRect, rotate, scale, x, y]);

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

      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode, viewportRef.current.height);

      const currentScale = scale.get();
      const isPinch = !!(event.ctrlKey || event.metaKey);
      // Zooming in is never gated on the current scale: gating it was what made
      // a plain wheel inert at the zoom floor, which reads as enormous damping.
      // Only scrolling *down* while already at the floor has nowhere left to go,
      // and that is precisely where the dismiss gesture takes over.
      const zoomingIn = delta < 0;

      if (isPinch || zoomingIn || !isAtFitFloor()) {
        disarmedRef.current = true;
        closeAccumRef.current = 0;

        const rawTarget = currentScale * wheelZoomFactor(delta);

        if (rawTarget <= MIN_SCALE) {
          animate(scale, MIN_SCALE, RESET_TRANSITION);
          animate(x, 0, RESET_TRANSITION);
          animate(y, 0, RESET_TRANSITION);
          return;
        }

        const targetScale = clampScale(rawTarget, effectiveMaxScale());
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

      // Deliberately not isCleanState(): an image that opened at 100% and was
      // scrolled back down to fit has "changed" by that measure, yet it is
      // exactly where the dismiss gesture belongs. Only orientation is worth
      // protecting here.
      if (disarmedRef.current || !isOrientationClean()) return;

      closeAccumRef.current += Math.abs(delta);
      if (closeAccumRef.current >= WHEEL_CLOSE_THRESHOLD) {
        closeAccumRef.current = 0;
        onCloseRequestRef.current?.();
      }
    },
    [
      applyTransform,
      closing,
      effectiveMaxScale,
      getFitRect,
      isAtFitFloor,
      isOrientationClean,
      scale,
      x,
      y,
    ],
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
    // Back to how the viewer opened, which is not necessarily fit.
    animate(scale, initialScaleRef.current, RESET_TRANSITION);
    animate(x, 0, RESET_TRANSITION);
    animate(y, 0, RESET_TRANSITION);
    animate(rotate, 0, RESET_TRANSITION);
    flipX.set(false);
    flipY.set(false);
  }, [closing, flipX, flipY, rotate, scale, x, y]);

  const dragBy = useCallback(
    (delta: Point) => {
      // A pointer can still be down when close starts (e.g. pinch to just
      // over 1x — inside isClean's epsilon, so Esc/wheel reads 'close' —
      // while the same gesture is still panning). Gated for consistency
      // with the other entry points even though .set() here can't cancel
      // the close spring outright, only cause a self-correcting flicker.
      if (closing()) return;
      const fitRect = getFitRect();
      const bounds = panBounds({ scale: scale.get(), x: 0, y: 0 }, fitRect, viewportRef.current);
      x.set(rubberBand(x.get() + delta.x, bounds.x.min, bounds.x.max));
      y.set(rubberBand(y.get() + delta.y, bounds.y.min, bounds.y.max));
    },
    [closing, getFitRect, scale, x, y],
  );

  const dragEnd = useCallback(() => {
    if (closing()) return;
    const fitRect = getFitRect();
    const clamped = clampPan(
      { scale: scale.get(), x: x.get(), y: y.get() },
      fitRect,
      viewportRef.current,
    );
    animate(x, clamped.x, RESET_TRANSITION);
    animate(y, clamped.y, RESET_TRANSITION);
  }, [closing, getFitRect, scale, x, y]);

  const escIntent = useCallback(
    (): 'reset' | 'close' => (isCleanState() ? 'close' : 'reset'),
    [isCleanState],
  );

  const setViewport = useCallback(
    (next: Size) => {
      viewportRef.current = next;
      const fitRect = computeFit(
        naturalRef.current,
        next,
        normalizeRotation(rotate.get()),
        fillViewportRef.current,
      );
      const clamped = clampPan({ scale: scale.get(), x: x.get(), y: y.get() }, fitRect, next);
      x.set(clamped.x);
      y.set(clamped.y);
    },
    [rotate, scale, x, y],
  );

  const setNatural = useCallback(
    (next: Size) => {
      const wasClean = isCleanState();
      naturalRef.current = next;
      const rotation = normalizeRotation(rotate.get());
      initialScaleRef.current = computeInitialScale(rotation);

      // A dual-source entry opens on the thumbnail's intrinsic size and only
      // learns the hi-res one here, which can move the opening scale (a 400px
      // stand-in is fit-sized; the 2000px original it becomes is not). Re-land
      // only if the user hasn't taken over — and never mid-transition, where
      // .jump() would kill the open FLIP's spring instead of joining it.
      if (wasClean && !closing() && !isTransitioningRef.current?.()) {
        scale.jump(initialScaleRef.current);
      }

      const fitRect = computeFit(next, viewportRef.current, rotation, fillViewportRef.current);
      const clamped = clampPan(
        { scale: scale.get(), x: x.get(), y: y.get() },
        fitRect,
        viewportRef.current,
      );
      x.set(clamped.x);
      y.set(clamped.y);
    },
    [closing, computeInitialScale, isCleanState, rotate, scale, x, y],
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
    getInitialScale,
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
    toggleActualSize,
    x,
    y,
    zoomIn,
    zoomOut,
  };
};

export type { Point, Rotation, Size, ZoomPolicy } from './geometry';
