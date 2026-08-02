import { describe, expect, it } from 'vitest';

import type { Point, Rect, TransformState } from './geometry';
import {
  anchoredZoom,
  clampPan,
  clampScale,
  computeFit,
  doubleClickTarget,
  naturalScale,
  normalizeRotation,
  rubberBand,
  wheelZoomFactor,
} from './geometry';

const project = (state: TransformState, point: Point, fitRect: Rect): Point => {
  const centerX = fitRect.x + fitRect.width / 2;
  const centerY = fitRect.y + fitRect.height / 2;
  return {
    x: centerX + (point.x - centerX) * state.scale + state.x,
    y: centerY + (point.y - centerY) * state.scale + state.y,
  };
};

const unproject = (state: TransformState, screenPoint: Point, fitRect: Rect): Point => {
  const centerX = fitRect.x + fitRect.width / 2;
  const centerY = fitRect.y + fitRect.height / 2;
  return {
    x: centerX + (screenPoint.x - centerX - state.x) / state.scale,
    y: centerY + (screenPoint.y - centerY - state.y) / state.scale,
  };
};

describe('computeFit', () => {
  it('contains a landscape image within the viewport minus margins', () => {
    const rect = computeFit({ height: 2000, width: 4000 }, { height: 800, width: 1200 }, 0);
    expect(rect).toEqual({ height: 576, width: 1152, x: 24, y: 112 });
  });

  it('contains a portrait image within the viewport minus margins', () => {
    const rect = computeFit({ height: 4000, width: 2000 }, { height: 800, width: 1200 }, 0);
    expect(rect).toEqual({ height: 752, width: 376, x: 412, y: 24 });
  });

  it('never upscales a small image beyond its natural size', () => {
    const rect = computeFit({ height: 300, width: 400 }, { height: 800, width: 1200 }, 0);
    expect(rect).toEqual({ height: 300, width: 400, x: 400, y: 250 });
  });

  it('swaps effective natural dimensions when rotated 90deg', () => {
    const rect = computeFit({ height: 2000, width: 4000 }, { height: 800, width: 1200 }, 90);
    expect(rect).toEqual({ height: 752, width: 376, x: 412, y: 24 });
  });

  it('swaps effective natural dimensions when rotated 270deg', () => {
    const rect = computeFit({ height: 2000, width: 4000 }, { height: 800, width: 1200 }, 270);
    expect(rect).toEqual({ height: 752, width: 376, x: 412, y: 24 });
  });

  it('does not swap dimensions when rotated 180deg', () => {
    const rect = computeFit({ height: 2000, width: 4000 }, { height: 800, width: 1200 }, 180);
    expect(rect).toEqual({ height: 576, width: 1152, x: 24, y: 112 });
  });

  it('always centers the fit rect in the viewport', () => {
    const rect = computeFit({ height: 300, width: 700 }, { height: 900, width: 1000 }, 0);
    expect(rect.x + rect.width / 2).toBeCloseTo(500, 10);
    expect(rect.y + rect.height / 2).toBeCloseTo(450, 10);
  });
});

describe('anchoredZoom', () => {
  const fitRect: Rect = { height: 100, width: 200, x: 0, y: 0 };

  it('matches a hand-computed zoom-in from identity', () => {
    const current: TransformState = { scale: 1, x: 0, y: 0 };
    const next = anchoredZoom(current, 2, { x: 150, y: 50 }, fitRect);
    expect(next).toEqual({ scale: 2, x: -50, y: 0 });
  });

  it('keeps the image point under the cursor fixed across a zoom-in', () => {
    const current: TransformState = { scale: 2, x: 20, y: -10 };
    const anchor: Point = { x: 250, y: 180 };
    const layoutPoint = unproject(current, anchor, { height: 300, width: 400, x: 100, y: 50 });
    const next = anchoredZoom(current, 4, anchor, { height: 300, width: 400, x: 100, y: 50 });
    const projected = project(next, layoutPoint, { height: 300, width: 400, x: 100, y: 50 });
    expect(projected.x).toBeCloseTo(anchor.x, 9);
    expect(projected.y).toBeCloseTo(anchor.y, 9);
  });

  it('keeps the image point under the cursor fixed across a zoom-out', () => {
    const current: TransformState = { scale: 5, x: -80, y: 40 };
    const anchor: Point = { x: 60, y: 90 };
    const layoutPoint = unproject(current, anchor, fitRect);
    const next = anchoredZoom(current, 1.5, anchor, fitRect);
    const projected = project(next, layoutPoint, fitRect);
    expect(projected.x).toBeCloseTo(anchor.x, 9);
    expect(projected.y).toBeCloseTo(anchor.y, 9);
  });

  it('keeps the anchor fixed when anchoring off-center', () => {
    const current: TransformState = { scale: 1, x: 0, y: 0 };
    const anchor: Point = { x: 10, y: 90 };
    const layoutPoint = unproject(current, anchor, fitRect);
    const next = anchoredZoom(current, 3, anchor, fitRect);
    const projected = project(next, layoutPoint, fitRect);
    expect(projected.x).toBeCloseTo(anchor.x, 9);
    expect(projected.y).toBeCloseTo(anchor.y, 9);
  });
});

describe('clampPan', () => {
  const viewport = { height: 800, width: 1200 };

  it('centers translation to zero on both axes when the image fits entirely', () => {
    const fitRect: Rect = { height: 300, width: 400, x: 400, y: 250 };
    const result = clampPan({ scale: 1, x: 999, y: -999 }, fitRect, viewport);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('clamps only the x axis when only the x axis overflows', () => {
    const fitRect: Rect = { height: 400, width: 1200, x: 0, y: 200 };
    const overflow = clampPan({ scale: 1.5, x: 500, y: 50 }, fitRect, viewport);
    expect(overflow).toEqual({ x: 300, y: 0 });
    const underflow = clampPan({ scale: 1.5, x: -500, y: -50 }, fitRect, viewport);
    expect(underflow).toEqual({ x: -300, y: 0 });
  });

  it('clamps only the y axis when only the y axis overflows', () => {
    const fitRect: Rect = { height: 800, width: 500, x: 350, y: 0 };
    const overflow = clampPan({ scale: 1.5, x: 99, y: 250 }, fitRect, viewport);
    expect(overflow).toEqual({ x: 0, y: 200 });
    const underflow = clampPan({ scale: 1.5, x: -99, y: -250 }, fitRect, viewport);
    expect(underflow).toEqual({ x: 0, y: -200 });
  });

  it('leaves in-bounds translation untouched when both axes overflow', () => {
    const fitRect: Rect = { height: 400, width: 1200, x: 0, y: 200 };
    const result = clampPan({ scale: 3, x: 50, y: -50 }, fitRect, viewport);
    expect(result).toEqual({ x: 50, y: -50 });
  });
});

describe('rubberBand', () => {
  it('passes values inside the bounds through unchanged', () => {
    expect(rubberBand(50, -100, 100)).toBe(50);
    expect(rubberBand(-100, -100, 100)).toBe(-100);
    expect(rubberBand(100, -100, 100)).toBe(100);
  });

  it('compresses overshoot above the max by the given factor', () => {
    expect(rubberBand(150, -100, 100, 0.15)).toBeCloseTo(107.5, 10);
  });

  it('compresses overshoot below the min by the given factor', () => {
    expect(rubberBand(-150, -100, 100, 0.15)).toBeCloseTo(-107.5, 10);
  });

  it('defaults the factor to 0.15', () => {
    expect(rubberBand(200, 0, 100)).toBeCloseTo(115, 10);
  });
});

describe('clampScale', () => {
  it('clamps below the minimum of 1 up to 1', () => {
    expect(clampScale(0.5)).toBe(1);
  });

  it('clamps above the max down to the max', () => {
    expect(clampScale(10, 8)).toBe(8);
  });

  it('defaults the max to 8', () => {
    expect(clampScale(10)).toBe(8);
  });

  it('leaves in-bounds scale untouched', () => {
    expect(clampScale(3, 8)).toBe(3);
    expect(clampScale(1, 8)).toBe(1);
  });
});

describe('wheelZoomFactor', () => {
  it('returns 1 for a zero delta', () => {
    expect(wheelZoomFactor(0)).toBe(1);
  });

  it('returns a factor below 1 for a positive deltaY (zoom out)', () => {
    expect(wheelZoomFactor(100)).toBeCloseTo(0.8187307530779818, 12);
  });

  it('returns a factor above 1 for a negative deltaY (zoom in)', () => {
    expect(wheelZoomFactor(-100)).toBeCloseTo(1.2214027581601699, 12);
  });
});

describe('naturalScale', () => {
  it('computes the ratio of natural pixels to fit pixels', () => {
    const fitRect = computeFit({ height: 2000, width: 4000 }, { height: 800, width: 1200 }, 0);
    expect(naturalScale({ height: 2000, width: 4000 }, fitRect, 0)).toBeCloseTo(4000 / 1152, 10);
  });

  it('uses the swapped natural dimension when rotated', () => {
    const natural = { height: 2000, width: 4000 };
    const fitRect = computeFit(natural, { height: 800, width: 1200 }, 90);
    expect(naturalScale(natural, fitRect, 90)).toBeCloseTo(2000 / 376, 10);
  });

  it('is 1 when a small image is rendered at its natural size', () => {
    const natural = { height: 300, width: 400 };
    const fitRect = computeFit(natural, { height: 800, width: 1200 }, 0);
    expect(naturalScale(natural, fitRect, 0)).toBe(1);
  });
});

describe('doubleClickTarget', () => {
  it('returns 1 when already zoomed in', () => {
    const natural = { height: 2000, width: 4000 };
    const fitRect = computeFit(natural, { height: 800, width: 1200 }, 0);
    expect(doubleClickTarget(2.5, natural, fitRect, 0)).toBe(1);
  });

  it('returns the natural scale when it exceeds 2', () => {
    const natural = { height: 2000, width: 4000 };
    const fitRect = computeFit(natural, { height: 800, width: 1200 }, 0);
    expect(doubleClickTarget(1, natural, fitRect, 0)).toBeCloseTo(4000 / 1152, 10);
  });

  it('floors the target at 2 when the natural scale is below 2', () => {
    const natural = { height: 300, width: 400 };
    const fitRect = computeFit(natural, { height: 800, width: 1200 }, 0);
    expect(doubleClickTarget(1, natural, fitRect, 0)).toBe(2);
  });
});

describe('normalizeRotation', () => {
  it.each([
    [0, 0],
    [90, 90],
    [180, 180],
    [270, 270],
    [360, 0],
    [450, 90],
    [-90, 270],
    [-180, 180],
    [-270, 90],
    [-360, 0],
    [-450, 270],
    [720, 0],
    [-720, 0],
  ])('normalizes %i to %i', (input, expected) => {
    expect(normalizeRotation(input)).toBe(expected);
  });
});
