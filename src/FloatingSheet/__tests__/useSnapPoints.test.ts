import { renderHook } from '@testing-library/react';

import { useSnapPoints } from '../useSnapPoints';

describe('useSnapPoints', () => {
  const mockContainer = {
    getBoundingClientRect: () => ({
      height: 800,
      width: 600,
      top: 0,
      left: 0,
      bottom: 800,
      right: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    }),
  } as HTMLElement;

  describe('resolveSnapPoints', () => {
    test('converts fractional snap points to pixel heights', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.3, 0.5, 0.8],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 0,
          maxHeightPx: 800,
        }),
      );

      expect(result.current.snapPointHeights).toEqual([240, 400, 640]);
    });

    test('clamps snap points to minHeight/maxHeight', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.1, 0.5, 0.95],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 200,
          maxHeightPx: 600,
        }),
      );

      // 0.1*800=80 → clamped to 200, 0.5*800=400, 0.95*800=760 → clamped to 600
      expect(result.current.snapPointHeights).toEqual([200, 400, 600]);
    });

    test('removes duplicates after clamping', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.05, 0.1, 0.5],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 200,
          maxHeightPx: 800,
        }),
      );

      // 0.05*800=40 → 200, 0.1*800=80 → 200, 0.5*800=400
      // duplicates removed → [200, 400]
      expect(result.current.snapPointHeights).toEqual([200, 400]);
    });
  });

  describe('findClosestSnapPoint', () => {
    test('finds closest snap point height', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.3, 0.5, 0.8],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 0,
          maxHeightPx: 800,
        }),
      );

      // snapPointHeights: [240, 400, 640]
      expect(result.current.findClosestSnapPoint(350)).toBe(400);
      expect(result.current.findClosestSnapPoint(500)).toBe(400);
      expect(result.current.findClosestSnapPoint(550)).toBe(640);
    });
  });

  describe('getSnapRelease', () => {
    test('high velocity upward jumps to next snap point', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.3, 0.5, 0.8],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 0,
          maxHeightPx: 800,
        }),
      );

      // snapPointHeights: [240, 400, 640]
      // Currently at index 1 (400px), high velocity upward
      const release = result.current.getSnapRelease({
        currentHeight: 400,
        activeIndex: 1,
        draggedDistance: 30,
        velocity: 0.8,
        dismissible: true,
      });

      expect(release).toEqual({ type: 'snap', height: 640 });
    });

    test('high velocity downward from lowest snap dismisses', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.3, 0.5, 0.8],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 0,
          maxHeightPx: 800,
        }),
      );

      const release = result.current.getSnapRelease({
        currentHeight: 240,
        activeIndex: 0,
        draggedDistance: -30,
        velocity: 0.8,
        dismissible: true,
      });

      expect(release).toEqual({ type: 'dismiss' });
    });

    test('high velocity downward from lowest snap without dismissible snaps back', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.3, 0.5, 0.8],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 0,
          maxHeightPx: 800,
        }),
      );

      const release = result.current.getSnapRelease({
        currentHeight: 240,
        activeIndex: 0,
        draggedDistance: -30,
        velocity: 0.8,
        dismissible: false,
      });

      expect(release).toEqual({ type: 'snap', height: 240 });
    });

    test('low velocity snaps to closest', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.3, 0.5, 0.8],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 0,
          maxHeightPx: 800,
        }),
      );

      const release = result.current.getSnapRelease({
        currentHeight: 350,
        activeIndex: 1,
        draggedDistance: -50,
        velocity: 0.1,
        dismissible: true,
      });

      // Closest to 350 is 400 (index 1) not 240 (index 0)
      expect(release).toEqual({ type: 'snap', height: 400 });
    });

    test('low velocity downward from lowest snap dismisses after crossing close threshold', () => {
      const { result } = renderHook(() =>
        useSnapPoints({
          closeThreshold: 0.25,
          snapPoints: [0.3, 0.5, 0.8],
          containerRef: { current: mockContainer },
          containerHeight: 800,
          minHeightPx: 0,
          maxHeightPx: 800,
        }),
      );

      const release = result.current.getSnapRelease({
        currentHeight: 50,
        activeIndex: 0,
        draggedDistance: -190,
        velocity: 0.1,
        dismissible: true,
      });

      expect(release).toEqual({ type: 'dismiss' });
    });
  });
});
