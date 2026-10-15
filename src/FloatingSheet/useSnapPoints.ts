import { type RefObject, useMemo } from 'react';

import { clamp, resolveSize } from './helpers';

const VELOCITY_THRESHOLD = 0.4;
const DRAG_DISTANCE_RATIO = 0.4;

interface UseSnapPointsOptions {
  closeThreshold: number;
  containerHeight: number;
  containerRef: RefObject<HTMLElement | null>;
  maxHeightPx: number;
  minHeightPx: number;
  snapPoints: number[];
}

interface SnapReleaseParams {
  activeIndex: number;
  currentHeight: number;
  dismissible: boolean;
  draggedDistance: number; // positive = upward (growing), negative = downward (shrinking)
  velocity: number;
}

type SnapReleaseResult = { type: 'snap'; height: number } | { type: 'dismiss' };

export function useSnapPoints({
  closeThreshold,
  snapPoints,
  containerHeight,
  minHeightPx,
  maxHeightPx,
}: UseSnapPointsOptions) {
  const snapPointHeights = useMemo(() => {
    if (!containerHeight) return [];

    const resolved = snapPoints
      .map((sp) => clamp(resolveSize(sp, containerHeight), minHeightPx, maxHeightPx))
      .sort((a, b) => a - b);

    // Remove duplicates
    return [...new Set(resolved)];
  }, [snapPoints, containerHeight, minHeightPx, maxHeightPx]);

  function findClosestSnapPoint(height: number): number {
    if (snapPointHeights.length === 0) return clamp(height, minHeightPx, maxHeightPx);

    return snapPointHeights.reduce((prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev,
    );
  }

  function findActiveIndex(height: number): number {
    const closest = findClosestSnapPoint(height);
    return snapPointHeights.indexOf(closest);
  }

  function getSnapRelease({
    currentHeight,
    activeIndex,
    draggedDistance,
    velocity,
    dismissible,
  }: SnapReleaseParams): SnapReleaseResult {
    const isFirst = activeIndex === 0;
    const isLast = activeIndex === snapPointHeights.length - 1;
    const isDraggingUp = draggedDistance > 0;
    const highestSnapPoint = snapPointHeights.at(-1) ?? maxHeightPx;
    const lowestSnapPoint = snapPointHeights[0] ?? minHeightPx;
    const nextHigherSnapPoint =
      snapPointHeights[Math.min(activeIndex + 1, snapPointHeights.length - 1)] ?? highestSnapPoint;
    const nextLowerSnapPoint = snapPointHeights[Math.max(activeIndex - 1, 0)] ?? lowestSnapPoint;
    const sheetHeight = snapPointHeights[activeIndex] ?? currentHeight;

    // High velocity handling
    if (
      velocity > VELOCITY_THRESHOLD &&
      Math.abs(draggedDistance) < sheetHeight * DRAG_DISTANCE_RATIO
    ) {
      if (isDraggingUp) {
        // Fling upward: go to next higher snap, cap at highest
        if (isLast) return { type: 'snap', height: highestSnapPoint };

        return { type: 'snap', height: nextHigherSnapPoint };
      } else {
        // Fling downward: go to next lower snap, or dismiss if at lowest
        if (isFirst) {
          return dismissible ? { type: 'dismiss' } : { type: 'snap', height: lowestSnapPoint };
        }

        return { type: 'snap', height: nextLowerSnapPoint };
      }
    }

    if (
      dismissible &&
      isFirst &&
      !isDraggingUp &&
      currentHeight < lowestSnapPoint * closeThreshold
    ) {
      return { type: 'dismiss' };
    }

    // Low velocity: snap to closest
    const closest = findClosestSnapPoint(currentHeight);
    return { type: 'snap', height: closest };
  }

  return {
    snapPointHeights,
    findClosestSnapPoint,
    findActiveIndex,
    getSnapRelease,
  };
}
