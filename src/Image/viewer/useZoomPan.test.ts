import { act, renderHook } from '@testing-library/react';
import { animate } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { UseZoomPanOptions, WheelLikeEvent } from './useZoomPan';
import { useZoomPan } from './useZoomPan';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return {
    ...actual,
    animate: vi.fn((value: { set: (next: number) => void }, target: number) => {
      value.set(target);
      return { stop: vi.fn() };
    }),
  };
});

const animateMock = vi.mocked(animate);

const NATURAL = { height: 2000, width: 4000 };
const VIEWPORT = { height: 800, width: 1200 };
const VIEWPORT_CENTER = { x: VIEWPORT.width / 2, y: VIEWPORT.height / 2 };

const wheelEvent = (overrides: Partial<WheelLikeEvent> = {}): WheelLikeEvent => ({
  clientX: VIEWPORT_CENTER.x,
  clientY: VIEWPORT_CENTER.y,
  deltaY: 0,
  preventDefault: vi.fn(),
  ...overrides,
});

const setup = (options: Partial<UseZoomPanOptions> = {}) =>
  renderHook(() => useZoomPan({ natural: NATURAL, viewport: VIEWPORT, ...options }));

beforeEach(() => {
  vi.useFakeTimers();
  animateMock.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('initial state', () => {
  it('starts clean, not zoomed, zoom-in available, zoom-out unavailable', () => {
    const { result } = setup();
    expect(result.current.isClean).toBe(true);
    expect(result.current.isZoomed).toBe(false);
    expect(result.current.canZoomIn).toBe(true);
    expect(result.current.canZoomOut).toBe(false);
    expect(result.current.scale.get()).toBe(1);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });
});

describe('handleWheel', () => {
  it('calls preventDefault on every wheel event', () => {
    const { result } = setup();
    const preventDefault = vi.fn();
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 10, preventDefault }));
    });
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('ctrl+wheel anchored-zooms from the clean state', () => {
    const { result } = setup();
    act(() => {
      result.current.handleWheel(wheelEvent({ ctrlKey: true, deltaY: -100 }));
    });
    expect(result.current.scale.get()).toBeCloseTo(1.2214027581601699, 10);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });

  it('meta+wheel anchored-zooms from the clean state', () => {
    const { result } = setup();
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: -100, metaKey: true }));
    });
    expect(result.current.scale.get()).toBeCloseTo(1.2214027581601699, 10);
  });

  it('plain wheel while zoomed anchored-zooms and never touches the close accumulator', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.scale.set(2);
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: -50 }));
    });
    expect(result.current.scale.get()).toBeCloseTo(2.2103418361512954, 10);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
    expect(onCloseRequest).not.toHaveBeenCalled();
  });

  it('plain wheel at clean fit accumulates deltaY without closing below the threshold', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 60 }));
    });
    expect(onCloseRequest).not.toHaveBeenCalled();
    expect(result.current.scale.get()).toBe(1);
  });

  it('plain wheel at clean fit requests close once the accumulated deltaY reaches 100', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 60 }));
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 45 }));
    });
    expect(onCloseRequest).toHaveBeenCalledTimes(1);
  });

  it('resets the close accumulator after 300ms of wheel idle', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 60 }));
    });
    vi.advanceTimersByTime(300);
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 60 }));
    });
    expect(onCloseRequest).not.toHaveBeenCalled();
  });

  it('plain wheel does nothing (no zoom, no close) while rotated at scale 1', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.rotate.set(90);
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 150 }));
    });
    expect(result.current.scale.get()).toBe(1);
    expect(onCloseRequest).not.toHaveBeenCalled();
  });

  it('plain wheel does nothing (no zoom, no close) while flipped at scale 1', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.flipX.set(true);
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 150 }));
    });
    expect(result.current.scale.get()).toBe(1);
    expect(onCloseRequest).not.toHaveBeenCalled();
  });

  it('ctrl+wheel still anchored-zooms while rotated at scale 1', () => {
    const { result } = setup();
    act(() => {
      result.current.rotate.set(90);
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ ctrlKey: true, deltaY: -100 }));
    });
    expect(result.current.scale.get()).toBeCloseTo(1.2214027581601699, 10);
  });

  it('regression: rotateRight resets scale to 1 but does not arm the close accumulator', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.rotateRight();
    });
    expect(result.current.scale.get()).toBe(1);
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 60 }));
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 60 }));
    });
    expect(onCloseRequest).not.toHaveBeenCalled();
  });

  it('clamps a zoom-out overshoot to exactly 1 and springs the pan back to zero', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2);
      result.current.x.set(50);
      result.current.y.set(-30);
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 400 }));
    });
    expect(result.current.scale.get()).toBe(1);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
    expect(animateMock).toHaveBeenCalledWith(result.current.scale, 1, expect.any(Object));
    expect(animateMock).toHaveBeenCalledWith(result.current.x, 0, expect.any(Object));
    expect(animateMock).toHaveBeenCalledWith(result.current.y, 0, expect.any(Object));
  });

  it('disarms the close accumulator after a zoom mutation until 300ms of wheel idle passes', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });

    act(() => {
      result.current.scale.set(2);
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 400 }));
    });
    act(() => {
      result.current.scale.set(1);
    });

    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 150 }));
    });
    expect(onCloseRequest).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 150 }));
    });
    expect(onCloseRequest).toHaveBeenCalledTimes(1);
  });
});

describe('handleDoubleClick', () => {
  it('zooms from clean fit to max(2, naturalScale) anchored at the click point', () => {
    const { result } = setup();
    act(() => {
      result.current.handleDoubleClick(VIEWPORT_CENTER);
    });
    expect(result.current.scale.get()).toBeCloseTo(3.4722222222222223, 10);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });

  it('returns to scale 1 and recenters when double-clicking while zoomed', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2.5);
      result.current.x.set(10);
      result.current.y.set(5);
    });
    act(() => {
      result.current.handleDoubleClick({ x: 300, y: 300 });
    });
    expect(result.current.scale.get()).toBe(1);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });

  it('floors the zoom-in target at 2 for a small image already at natural size', () => {
    const { result } = setup({ natural: { height: 300, width: 400 } });
    act(() => {
      result.current.handleDoubleClick(VIEWPORT_CENTER);
    });
    expect(result.current.scale.get()).toBe(2);
  });
});

describe('escIntent', () => {
  it('is close when clean', () => {
    const { result } = setup();
    expect(result.current.escIntent()).toBe('close');
  });

  it('is reset when zoomed', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2);
    });
    expect(result.current.escIntent()).toBe('reset');
  });

  it('is reset when rotated', () => {
    const { result } = setup();
    act(() => {
      result.current.rotate.set(90);
    });
    expect(result.current.escIntent()).toBe('reset');
  });

  it('is reset when flipped horizontally', () => {
    const { result } = setup();
    act(() => {
      result.current.flipX.set(true);
    });
    expect(result.current.escIntent()).toBe('reset');
  });

  it('is reset when flipped vertically', () => {
    const { result } = setup();
    act(() => {
      result.current.flipY.set(true);
    });
    expect(result.current.escIntent()).toBe('reset');
  });

  it('is close once a settling reset spring rests within tolerance of the target', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(0.9991);
      result.current.rotate.set(0.004);
    });
    expect(result.current.escIntent()).toBe('close');
  });

  it('is still reset when meaningfully off target', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(1.05);
    });
    expect(result.current.escIntent()).toBe('reset');
  });
});

describe('zoomIn / zoomOut bounds', () => {
  it('does not zoom out below scale 1', () => {
    const { result } = setup();
    act(() => {
      result.current.zoomOut();
    });
    expect(result.current.scale.get()).toBe(1);
    expect(result.current.canZoomOut).toBe(false);
  });

  it('does not zoom in past maxScale and flips canZoomIn off at the cap', () => {
    const { result } = setup({ maxScale: 2 });

    act(() => {
      result.current.zoomIn();
    });
    expect(result.current.scale.get()).toBeCloseTo(1.5, 10);
    expect(result.current.canZoomIn).toBe(true);

    act(() => {
      result.current.zoomIn();
    });
    expect(result.current.scale.get()).toBe(2);
    expect(result.current.canZoomIn).toBe(false);
    expect(result.current.canZoomOut).toBe(true);

    act(() => {
      result.current.zoomIn();
    });
    expect(result.current.scale.get()).toBe(2);
  });
});

describe('instant writes use jump(), not set()', () => {
  // jump() stops whatever spring is currently animating a value; set() does
  // not (verified against motion-dom's source: set() only calls
  // updateAndNotify, jump() also calls stop()). A surviving spring from a
  // dragEnd clamp-back or wheel snap-back — never tracked by useFlipTransition,
  // since useZoomPan owns these — would otherwise silently overwrite these
  // instant resets on its next tick. This only proves the call sites use the
  // right API; the full cancel-a-real-spring behavior is motion's own,
  // confirmed by source inspection and the live browser repro in the report.
  it('applyTransform (wheel-zoom) jumps scale/x/y for 1:1 gesture tracking', () => {
    const { result } = setup();
    const jumpScale = vi.spyOn(result.current.scale, 'jump');
    const jumpX = vi.spyOn(result.current.x, 'jump');
    const jumpY = vi.spyOn(result.current.y, 'jump');
    const setScale = vi.spyOn(result.current.scale, 'set');

    act(() => {
      result.current.handleWheel(wheelEvent({ ctrlKey: true, deltaY: -100 }));
    });

    expect(jumpScale).toHaveBeenCalledTimes(1);
    expect(jumpX).toHaveBeenCalledTimes(1);
    expect(jumpY).toHaveBeenCalledTimes(1);
    expect(setScale).not.toHaveBeenCalled();
  });

  it('stepped zoom (zoomIn/dblclick) animates scale/x/y instead of jumping', () => {
    const { result } = setup();
    const jumpScale = vi.spyOn(result.current.scale, 'jump');

    act(() => {
      result.current.zoomIn();
    });
    expect(animateMock).toHaveBeenCalledTimes(3);
    expect(jumpScale).not.toHaveBeenCalled();

    animateMock.mockClear();
    act(() => {
      result.current.handleDoubleClick(VIEWPORT_CENTER);
    });
    expect(animateMock).toHaveBeenCalledTimes(3);
    expect(jumpScale).not.toHaveBeenCalled();
  });

  it('rotateBy jumps rotate/scale/x/y', () => {
    const { result } = setup();
    const jumpRotate = vi.spyOn(result.current.rotate, 'jump');
    const jumpScale = vi.spyOn(result.current.scale, 'jump');
    const jumpX = vi.spyOn(result.current.x, 'jump');
    const jumpY = vi.spyOn(result.current.y, 'jump');
    const setRotate = vi.spyOn(result.current.rotate, 'set');

    act(() => {
      result.current.rotateLeft();
    });

    expect(jumpRotate).toHaveBeenCalledTimes(1);
    expect(jumpScale).toHaveBeenCalledTimes(1);
    expect(jumpX).toHaveBeenCalledTimes(1);
    expect(jumpY).toHaveBeenCalledTimes(1);
    expect(setRotate).not.toHaveBeenCalled();
  });
});

describe('rotateLeft / rotateRight', () => {
  it('rotates left by 90deg and resets scale and pan', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(3);
      result.current.x.set(50);
      result.current.y.set(20);
    });
    act(() => {
      result.current.rotateLeft();
    });
    expect(result.current.rotate.get()).toBe(270);
    expect(result.current.scale.get()).toBe(1);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
    expect(result.current.isClean).toBe(false);
  });

  it('rotates right by 90deg and wraps 270 back to 0', () => {
    const { result } = setup();
    act(() => {
      result.current.rotate.set(270);
    });
    act(() => {
      result.current.rotateRight();
    });
    expect(result.current.rotate.get()).toBe(0);
    expect(result.current.isClean).toBe(true);
  });
});

describe('flipHorizontal / flipVertical', () => {
  it('toggles flipX and back, tracking isClean', () => {
    const { result } = setup();
    act(() => {
      result.current.flipHorizontal();
    });
    expect(result.current.flipX.get()).toBe(true);
    expect(result.current.isClean).toBe(false);

    act(() => {
      result.current.flipHorizontal();
    });
    expect(result.current.flipX.get()).toBe(false);
    expect(result.current.isClean).toBe(true);
  });

  it('toggles flipY and back, tracking isClean', () => {
    const { result } = setup();
    act(() => {
      result.current.flipVertical();
    });
    expect(result.current.flipY.get()).toBe(true);
    expect(result.current.isClean).toBe(false);

    act(() => {
      result.current.flipVertical();
    });
    expect(result.current.flipY.get()).toBe(false);
    expect(result.current.isClean).toBe(true);
  });
});

describe('reset', () => {
  it('animates scale, x, y, rotate back to defaults and instantly clears flips', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(3);
      result.current.x.set(40);
      result.current.y.set(-20);
      result.current.rotate.set(90);
      result.current.flipX.set(true);
      result.current.flipY.set(true);
    });

    act(() => {
      result.current.reset();
    });
    expect(result.current.rotate.get()).toBe(0);
    expect(result.current.flipX.get()).toBe(false);
    expect(result.current.flipY.get()).toBe(false);
    expect(result.current.scale.get()).toBe(1);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
    expect(result.current.isClean).toBe(true);
    expect(animateMock).toHaveBeenCalledWith(result.current.scale, 1, expect.any(Object));
    expect(animateMock).toHaveBeenCalledWith(result.current.x, 0, expect.any(Object));
    expect(animateMock).toHaveBeenCalledWith(result.current.y, 0, expect.any(Object));
    expect(animateMock).toHaveBeenCalledWith(result.current.rotate, 0, expect.any(Object));
  });
});

describe('dragBy / dragEnd', () => {
  it('applies translation unchanged when within pan bounds', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2);
    });
    act(() => {
      result.current.dragBy({ x: 100, y: 50 });
    });
    expect(result.current.x.get()).toBe(100);
    expect(result.current.y.get()).toBe(50);
  });

  it('rubber-bands translation that overshoots the pan bounds', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2);
    });
    act(() => {
      result.current.dragBy({ x: 700, y: 0 });
    });
    expect(result.current.x.get()).toBeCloseTo(574.2, 10);
  });

  it('springs an overshot drag back to the clamped bound on drag end', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2);
    });
    act(() => {
      result.current.dragBy({ x: 700, y: 0 });
    });
    act(() => {
      result.current.dragEnd();
    });
    expect(result.current.x.get()).toBe(552);
    expect(result.current.y.get()).toBe(0);
    expect(animateMock).toHaveBeenCalledWith(result.current.x, 552, expect.any(Object));
    expect(animateMock).toHaveBeenCalledWith(result.current.y, 0, expect.any(Object));
  });
});

describe('setViewport / setNatural', () => {
  it('re-clamps pan when the viewport grows and the bounds shrink', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2);
      result.current.x.set(552);
    });
    act(() => {
      result.current.setViewport({ height: 800, width: 2000 });
    });
    expect(result.current.x.get()).toBeCloseTo(504, 10);
  });

  it('re-clamps pan to zero when swapping to a natural size that no longer overflows', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2);
      result.current.x.set(552);
    });
    act(() => {
      result.current.setNatural({ height: 50, width: 100 });
    });
    expect(result.current.x.get()).toBe(0);
  });
});

describe('derived state reactivity', () => {
  it('updates isZoomed and isClean when a motion value is set directly', () => {
    const { result } = setup();
    act(() => {
      result.current.scale.set(2);
    });
    expect(result.current.isZoomed).toBe(true);
    expect(result.current.isClean).toBe(false);

    act(() => {
      result.current.scale.set(1);
    });
    expect(result.current.isZoomed).toBe(false);
    expect(result.current.isClean).toBe(true);
  });
});

describe('closing gate', () => {
  it('no-ops zoomIn/zoomOut, rotateLeft/rotateRight, flips, reset, and doubleClick while closing', () => {
    const { result } = setup({ isClosing: () => true });

    act(() => {
      result.current.zoomIn();
      result.current.zoomOut();
      result.current.rotateLeft();
      result.current.rotateRight();
      result.current.flipHorizontal();
      result.current.flipVertical();
      result.current.reset();
      result.current.handleDoubleClick(VIEWPORT_CENTER);
    });

    expect(result.current.scale.get()).toBe(1);
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
    expect(result.current.rotation).toBe(0);
    expect(animateMock).not.toHaveBeenCalled();
  });

  it('no-ops dragBy and dragEnd while closing, leaving pan and any clamp-back spring untouched', () => {
    const { result } = setup({ isClosing: () => true });
    act(() => {
      result.current.scale.set(2);
    });

    act(() => {
      result.current.dragBy({ x: 700, y: 0 });
    });
    expect(result.current.x.get()).toBe(0);

    act(() => {
      result.current.dragEnd();
    });
    expect(animateMock).not.toHaveBeenCalled();
  });

  it('no-ops the wheel handler while closing, without arming wheel-close either', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ isClosing: () => true, onCloseRequest });

    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 60 }));
      result.current.handleWheel(wheelEvent({ deltaY: 60 }));
    });

    expect(onCloseRequest).not.toHaveBeenCalled();
    expect(result.current.scale.get()).toBe(1);
  });

  it('resumes normal behavior once isClosing flips back to false', () => {
    let closing = true;
    const { result, rerender } = renderHook(
      (isClosingFlag: boolean) =>
        useZoomPan({ isClosing: () => isClosingFlag, natural: NATURAL, viewport: VIEWPORT }),
      { initialProps: closing },
    );

    act(() => {
      result.current.zoomIn();
    });
    expect(result.current.scale.get()).toBe(1);

    closing = false;
    rerender(closing);
    act(() => {
      result.current.zoomIn();
    });
    expect(result.current.scale.get()).toBeCloseTo(1.5, 4);
  });
});

describe('defaultZoom', () => {
  // 1600 / (1200 - 48) = 1.389x the fit box: a screenshot-shaped image that is
  // only modestly larger than the viewport.
  const MODEST = { height: 800, width: 1600 };
  const MODEST_ACTUAL = 1600 / 1152;
  // NATURAL is 3.472x the fit box: a photo-shaped image.
  const NATURAL_ACTUAL = 4000 / 1152;

  it('opens at the zoom floor under the fit policy regardless of image size', () => {
    const { result } = setup({ defaultZoom: 'fit', natural: MODEST });
    expect(result.current.scale.get()).toBe(1);
    expect(result.current.isZoomed).toBe(false);
  });

  it('opens at natural size under the actual policy', () => {
    const { result } = setup({ defaultZoom: 'actual', natural: MODEST });
    expect(result.current.scale.get()).toBeCloseTo(MODEST_ACTUAL, 10);
  });

  it('opens a modestly oversized image at natural size under auto', () => {
    const { result } = setup({ defaultZoom: 'auto', natural: MODEST });
    expect(result.current.scale.get()).toBeCloseTo(MODEST_ACTUAL, 10);
  });

  it('opens a far oversized image at fit under auto, keeping the whole frame visible', () => {
    const { result } = setup({ defaultZoom: 'auto', natural: NATURAL });
    expect(result.current.scale.get()).toBe(1);
  });

  it('honours a caller-tuned autoZoomThreshold', () => {
    const { result } = setup({ autoZoomThreshold: 4, defaultZoom: 'auto', natural: NATURAL });
    expect(result.current.scale.get()).toBeCloseTo(NATURAL_ACTUAL, 10);
  });

  it('defaults to auto when no policy is supplied', () => {
    const { result } = setup({ natural: MODEST });
    expect(result.current.scale.get()).toBeCloseTo(MODEST_ACTUAL, 10);
  });

  // The whole dismiss system keys off isClean. Opening above the zoom floor
  // must not read as "the user changed something", or Esc stops closing on the
  // first press, clicking the image stops closing, and the close animation
  // degrades from a FLIP back to the thumbnail into a plain fade.
  it('opens clean even above the zoom floor, so Esc still closes on the first press', () => {
    const { result } = setup({ defaultZoom: 'actual', natural: MODEST });
    expect(result.current.isClean).toBe(true);
    expect(result.current.escIntent()).toBe('close');
  });

  it('opens pannable when it opens above the zoom floor', () => {
    const { result } = setup({ defaultZoom: 'actual', natural: MODEST });
    expect(result.current.isZoomed).toBe(true);
    act(() => {
      result.current.dragBy({ x: 60, y: 0 });
    });
    expect(result.current.x.get()).toBe(60);
  });

  it('resets back to the opening scale rather than to fit', () => {
    const { result } = setup({ defaultZoom: 'actual', natural: MODEST });
    act(() => {
      result.current.zoomIn();
    });
    expect(result.current.scale.get()).toBeGreaterThan(MODEST_ACTUAL);
    act(() => {
      result.current.reset();
    });
    expect(result.current.scale.get()).toBeCloseTo(MODEST_ACTUAL, 10);
    expect(result.current.isClean).toBe(true);
  });

  it('raises the zoom ceiling so actual size stays reachable past maxScale', () => {
    const { result } = setup({ defaultZoom: 'actual', maxScale: 2, natural: NATURAL });
    expect(result.current.scale.get()).toBeCloseTo(NATURAL_ACTUAL, 10);
    expect(result.current.canZoomIn).toBe(false);
  });

  it('dismisses once an image opened at actual size has been scrolled back to fit', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ defaultZoom: 'actual', natural: MODEST, onCloseRequest });

    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 1000 }));
    });
    expect(result.current.scale.get()).toBe(1);
    expect(onCloseRequest).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 150 }));
    });
    expect(onCloseRequest).toHaveBeenCalledTimes(1);
  });
});

describe('wheel direction split', () => {
  it('zooms in on a scroll up at the zoom floor instead of doing nothing', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: -100 }));
    });
    expect(result.current.scale.get()).toBeCloseTo(1.2214027581601699, 10);
    expect(onCloseRequest).not.toHaveBeenCalled();
  });

  it('still accumulates toward dismiss on a scroll down at the zoom floor', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 150 }));
    });
    expect(result.current.scale.get()).toBe(1);
    expect(onCloseRequest).toHaveBeenCalledTimes(1);
  });

  it('zooms in during the post-zoom-out disarm window instead of going dead', () => {
    const { result } = setup();
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: -100 }));
    });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: 1000 }));
    });
    expect(result.current.scale.get()).toBe(1);

    act(() => {
      result.current.handleWheel(wheelEvent({ deltaY: -100 }));
    });
    expect(result.current.scale.get()).toBeCloseTo(1.2214027581601699, 10);
  });

  it('treats a line-mode wheel notch like its pixel-mode equivalent', () => {
    const lines = setup();
    act(() => {
      lines.result.current.handleWheel(wheelEvent({ deltaMode: 1, deltaY: -3 }));
    });

    const pixels = setup();
    act(() => {
      pixels.result.current.handleWheel(wheelEvent({ deltaMode: 0, deltaY: -48 }));
    });

    expect(lines.result.current.scale.get()).toBeCloseTo(pixels.result.current.scale.get(), 12);
    expect(lines.result.current.scale.get()).toBeGreaterThan(1.09);
  });

  it('counts a line-mode scroll down toward dismiss at its pixel weight', () => {
    const onCloseRequest = vi.fn();
    const { result } = setup({ onCloseRequest });
    act(() => {
      result.current.handleWheel(wheelEvent({ deltaMode: 1, deltaY: 7 }));
    });
    expect(onCloseRequest).toHaveBeenCalledTimes(1);
  });
});

describe('toggleActualSize', () => {
  const MODEST = { height: 800, width: 1600 };
  const MODEST_ACTUAL = 1600 / 1152;

  it('jumps from fit to natural size', () => {
    const { result } = setup({ defaultZoom: 'fit', natural: MODEST });
    act(() => {
      result.current.toggleActualSize();
    });
    expect(result.current.scale.get()).toBeCloseTo(MODEST_ACTUAL, 10);
  });

  it('returns to fit when already at natural size', () => {
    const { result } = setup({ defaultZoom: 'actual', natural: MODEST });
    act(() => {
      result.current.toggleActualSize();
    });
    expect(result.current.scale.get()).toBe(1);
  });

  it('goes to natural size from an arbitrary zoom rather than toggling to fit', () => {
    const { result } = setup({ defaultZoom: 'fit', natural: MODEST });
    act(() => {
      result.current.zoomIn();
    });
    act(() => {
      result.current.toggleActualSize();
    });
    expect(result.current.scale.get()).toBeCloseTo(MODEST_ACTUAL, 10);
  });
});
