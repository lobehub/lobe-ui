import { renderHook } from '@testing-library/react';
import { animate, motionValue } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useRefitTransition, type UseRefitTransitionOptions } from './useRefitTransition';

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

const VIEWPORT = { height: 768, width: 1024 };

const setup = (overrides: Partial<UseRefitTransitionOptions> = {}) => {
  const scale = motionValue(1);
  const x = motionValue(0);
  const y = motionValue(0);
  const options: UseRefitTransitionOptions = {
    animated: true,
    isTransitioning: () => false,
    natural: { height: 320, width: 480 },
    rotation: 0,
    scale,
    viewport: VIEWPORT,
    x,
    y,
    ...overrides,
  };
  const { rerender } = renderHook((props: UseRefitTransitionOptions) => useRefitTransition(props), {
    initialProps: options,
  });
  return { options, rerender, scale, x, y };
};

beforeEach(() => {
  animateMock.mockClear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useRefitTransition', () => {
  it('does nothing on mount', () => {
    setup();
    expect(animateMock).not.toHaveBeenCalled();
  });

  it('does nothing when natural is unchanged across renders', () => {
    const { options, rerender } = setup();
    rerender({ ...options });
    expect(animateMock).not.toHaveBeenCalled();
  });

  it('compensates the transform then glides scale/x/y back when natural size changes at clean fit', () => {
    const { options, rerender, scale, x, y } = setup();
    rerender({ ...options, natural: { height: 1280, width: 1920 } });

    expect(animateMock).toHaveBeenCalledTimes(3);
    expect(scale.get()).toBe(1);
    expect(x.get()).toBe(0);
    expect(y.get()).toBe(0);
  });

  it('glides relative to the current (already zoomed/panned) transform', () => {
    const { options, rerender, scale, x, y } = setup();
    scale.set(2);
    x.set(30);
    y.set(-10);

    rerender({ ...options, natural: { height: 1280, width: 1920 } });

    expect(animateMock).toHaveBeenCalledTimes(3);
    expect(scale.get()).toBe(2);
    expect(x.get()).toBe(30);
    expect(y.get()).toBe(-10);
  });

  it('skips the glide when motion is unavailable (reduced motion)', () => {
    const { options, rerender } = setup({ animated: false });
    rerender({ ...options, animated: false, natural: { height: 1280, width: 1920 } });
    expect(animateMock).not.toHaveBeenCalled();
  });

  it('skips the glide when the fit rect is unchanged despite a natural-size change', () => {
    const { options, rerender } = setup({ natural: { height: 1000, width: 2000 } });
    rerender({ ...options, natural: { height: 2000, width: 4000 } });
    expect(animateMock).not.toHaveBeenCalled();
  });

  it('never animates scale/x/y while a FLIP open, close, or gallery switch is in flight', () => {
    const { options, rerender, scale, x, y } = setup({ isTransitioning: () => true });
    rerender({ ...options, isTransitioning: () => true, natural: { height: 1280, width: 1920 } });

    expect(animateMock).not.toHaveBeenCalled();
    expect(scale.get()).toBe(1);
    expect(x.get()).toBe(0);
    expect(y.get()).toBe(0);
  });

  it('resumes gliding once the in-flight transition settles for a later natural-size change', () => {
    const { options, rerender, scale } = setup({ isTransitioning: () => true });
    rerender({ ...options, isTransitioning: () => true, natural: { height: 1280, width: 1920 } });
    expect(animateMock).not.toHaveBeenCalled();

    rerender({
      ...options,
      isTransitioning: () => false,
      natural: { height: 600, width: 900 },
    });

    expect(animateMock).toHaveBeenCalledTimes(3);
    expect(scale.get()).toBe(1);
  });
});
