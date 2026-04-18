import { cx } from 'antd-style';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FloatingSheetHeader } from './FloatingSheetHeader';
import { clamp, dampenValue, resolveSize } from './helpers';
import { styles } from './style';
import type { FloatingSheetProps } from './type';
import { useSheetDrag } from './useSheetDrag';
import { useSnapPoints } from './useSnapPoints';

const ANIMATION_MS = 300;

export function FloatingSheet({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  snapPoints: snapPointsProp,
  activeSnapPoint: activeSnapPointProp,
  onSnapPointChange,
  minHeight: minHeightProp = 200,
  maxHeight: maxHeightProp = 0.8,
  restingHeight: restingHeightProp,
  mode = 'overlay',
  variant = 'elevated',
  width = '100%',
  title,
  headerActions,
  dismissible = true,
  closeThreshold = 0.25,
  children,
  className,
}: FloatingSheetProps) {
  const s = styles;

  // Controlled / uncontrolled open state
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? openProp : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  // Container measurement via ResizeObserver
  const containerRef = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const parent = sheetRef.current?.parentElement;
    if (!parent) return;
    containerRef.current = parent;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(parent);
    setContainerHeight(parent.getBoundingClientRect().height);

    return () => observer.disconnect();
  }, []);

  // Resolve min/max to px
  const minHeightPx = useMemo(
    () => resolveSize(minHeightProp, containerHeight),
    [minHeightProp, containerHeight],
  );
  const maxHeightPx = useMemo(
    () => resolveSize(maxHeightProp, containerHeight),
    [maxHeightProp, containerHeight],
  );
  const restingHeightPx = useMemo(
    () =>
      restingHeightProp !== undefined
        ? clamp(resolveSize(restingHeightProp, containerHeight), minHeightPx, maxHeightPx)
        : minHeightPx,
    [restingHeightProp, containerHeight, minHeightPx, maxHeightPx],
  );

  // Snap points
  const hasSnapPoints = !!snapPointsProp && snapPointsProp.length > 0;
  const { snapPointHeights, findActiveIndex, getSnapRelease } = useSnapPoints({
    closeThreshold,
    containerHeight,
    containerRef,
    maxHeightPx,
    minHeightPx,
    snapPoints: snapPointsProp ?? [],
  });

  // Compute the "resting" height for the current open + snap state
  const restingHeight = useMemo(() => {
    if (!containerHeight) return 0;
    if (hasSnapPoints && activeSnapPointProp !== undefined) {
      const resolved = resolveSize(activeSnapPointProp, containerHeight);
      return clamp(resolved, minHeightPx, maxHeightPx);
    }
    if (hasSnapPoints && snapPointHeights.length > 0) {
      return snapPointHeights[0];
    }
    return restingHeightPx;
  }, [
    containerHeight,
    hasSnapPoints,
    activeSnapPointProp,
    snapPointHeights,
    minHeightPx,
    maxHeightPx,
    restingHeightPx,
  ]);

  const [height, setHeight] = useState(isOpen ? restingHeight : 0);
  const [isAnimating, setIsAnimating] = useState(false);
  // Keeps sheet visible during close animation (height → 0)
  const [isClosing, setIsClosing] = useState(false);
  const heightBeforeDrag = useRef(0);
  const prevOpenRef = useRef(isOpen);

  // Handle open/close transitions
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      // Opening: animate from 0 → resting height
      setIsClosing(false);
      setIsAnimating(true);
      setHeight(restingHeight);
      const timer = setTimeout(() => setIsAnimating(false), ANIMATION_MS);
      return () => clearTimeout(timer);
    }

    if (!isOpen && wasOpen) {
      // Closing: animate from current height → 0, then hide
      setIsClosing(true);
      setIsAnimating(true);
      setHeight(0);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setIsClosing(false);
      }, ANIMATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync height when resting height changes (container resize, snap point change)
  useEffect(() => {
    if (isOpen && !isDragging) {
      setHeight(restingHeight);
    }
  }, [restingHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drag handlers
  const onDragChange = useCallback(
    (draggedDistance: number) => {
      const newHeight = heightBeforeDrag.current + draggedDistance;

      if (hasSnapPoints) {
        const highest = snapPointHeights.at(-1) ?? maxHeightPx;
        const lowest = snapPointHeights[0] ?? minHeightPx;

        if (newHeight > highest) {
          const overshoot = newHeight - highest;
          setHeight(highest + dampenValue(overshoot));
        } else if (newHeight < lowest) {
          const undershoot = lowest - newHeight;
          setHeight(Math.max(0, lowest - dampenValue(undershoot)));
        } else {
          setHeight(newHeight);
        }
      } else {
        setHeight(clamp(newHeight, 0, maxHeightPx));
      }
    },
    [hasSnapPoints, snapPointHeights, maxHeightPx, minHeightPx],
  );

  const onDragEnd = useCallback(
    (draggedDistance: number, velocity: number) => {
      setIsAnimating(true);
      const currentHeight = heightBeforeDrag.current + draggedDistance;

      if (hasSnapPoints) {
        const activeIndex = findActiveIndex(heightBeforeDrag.current);
        const result = getSnapRelease({
          activeIndex,
          currentHeight,
          dismissible,
          draggedDistance,
          velocity,
        });

        if (result.type === 'dismiss') {
          setIsClosing(true);
          setHeight(0);
          const timer = setTimeout(() => {
            setOpen(false);
            setIsAnimating(false);
            setIsClosing(false);
          }, ANIMATION_MS);
          return () => clearTimeout(timer);
        }

        setHeight(result.height);
        const originalSnapValue = snapPointsProp?.find(
          (sp) =>
            resolveSize(sp, containerHeight) === result.height ||
            clamp(resolveSize(sp, containerHeight), minHeightPx, maxHeightPx) === result.height,
        );
        if (originalSnapValue !== undefined) {
          onSnapPointChange?.(originalSnapValue);
        }
      } else {
        if (dismissible && currentHeight < minHeightPx * closeThreshold) {
          setIsClosing(true);
          setHeight(0);
          const timer = setTimeout(() => {
            setOpen(false);
            setIsAnimating(false);
            setIsClosing(false);
          }, ANIMATION_MS);
          return () => clearTimeout(timer);
        }
        setHeight(clamp(currentHeight, minHeightPx, maxHeightPx));
      }

      setTimeout(() => setIsAnimating(false), ANIMATION_MS);
    },
    [
      hasSnapPoints,
      findActiveIndex,
      getSnapRelease,
      dismissible,
      snapPointsProp,
      containerHeight,
      minHeightPx,
      maxHeightPx,
      closeThreshold,
      setOpen,
      onSnapPointChange,
    ],
  );

  const { isDragging, handleProps } = useSheetDrag({
    enabled: isOpen ?? false,
    onDragChange,
    onDragEnd,
  });

  // Record height at drag start
  useEffect(() => {
    if (isDragging) {
      heightBeforeDrag.current = height;
    }
  }, [isDragging]); // eslint-disable-line react-hooks/exhaustive-deps

  const isVisible = isOpen || isClosing || height > 0;
  const shouldAnimate = !isDragging && isAnimating;
  const inlineOverflowUp =
    mode === 'inline' && isVisible ? Math.max(0, height - restingHeightPx) : 0;

  return (
    <div
      data-floating-sheet=""
      data-state={isOpen ? 'open' : 'closed'}
      ref={sheetRef}
      className={cx(
        s.root,
        variant === 'embedded' ? s.embedded : s.elevated,
        mode === 'overlay' ? s.overlay : s.inline,
        mode === 'overlay' ? s.overlayRadius : s.inlineRadius,
        shouldAnimate && s.transition,
        !isVisible && s.hidden,
        className,
      )}
      style={{
        height: isVisible ? height : 0,
        marginTop: inlineOverflowUp ? -inlineOverflowUp : undefined,
        width,
      }}
    >
      <FloatingSheetHeader
        handleProps={handleProps}
        headerActions={headerActions}
        isDragging={isDragging}
        title={title}
      />
      <div className={s.content}>{children}</div>
    </div>
  );
}
