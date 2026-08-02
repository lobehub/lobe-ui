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
  it('animates scale, x, y back to defaults and instantly clears rotate and flips', () => {
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
