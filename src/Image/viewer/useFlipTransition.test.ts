import { act, renderHook } from '@testing-library/react';
import { animate, motionValue } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFlipTransition, type UseFlipTransitionOptions } from './useFlipTransition';

const motionMock = vi.hoisted(() => ({
  pending: [] as { run: () => void; stopped: boolean }[],
}));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  const activeByValue = new Map<unknown, { cancelled: boolean }>();
  return {
    ...actual,
    // Mirrors motion's real MotionValue.start() semantics: starting a new
    // animate() on a value stops whatever was already animating it, and that
    // cancellation never fires the prior call's onComplete.
    animate: vi.fn((value: { set: (next: unknown) => void }, target: unknown, options?: any) => {
      const previous = activeByValue.get(value);
      if (previous) previous.cancelled = true;
      const state = { cancelled: false };
      activeByValue.set(value, state);
      const task = {
        run: () => {
          if (state.cancelled) return;
          value.set(target);
          options?.onComplete?.();
        },
        stopped: false,
      };
      motionMock.pending.push(task);
      return {
        stop: () => {
          state.cancelled = true;
          task.stopped = true;
        },
      };
    }),
  };
});

const flushAnimations = () =>
  act(() => {
    const tasks = motionMock.pending.splice(0);
    for (const task of tasks) if (!task.stopped) task.run();
  });

const stubRect = (element: HTMLElement, rect: Partial<DOMRect>) => {
  const resolved = { height: 0, left: 0, top: 0, width: 0, ...rect };
  element.getBoundingClientRect = () =>
    ({
      ...resolved,
      bottom: resolved.top + resolved.height,
      right: resolved.left + resolved.width,
      toJSON: () => resolved,
      x: resolved.left,
      y: resolved.top,
    }) as DOMRect;
};

const setup = (overrides: Partial<UseFlipTransitionOptions> = {}) => {
  const source = document.createElement('img');
  document.body.append(source);
  stubRect(source, { height: 150, left: 100, top: 50, width: 200 });

  const flipX = motionValue(false);
  const flipY = motionValue(false);
  const rotate = motionValue(0);
  const scale = motionValue(1);
  const x = motionValue(0);
  const y = motionValue(0);

  const onClosed = vi.fn();
  const options: UseFlipTransitionOptions = {
    animated: true,
    getCloseSource: () => source,
    getFitRect: () => ({ height: 300, width: 400, x: 0, y: 0 }),
    getViewportWidth: () => 1024,
    onClosed,
    source,
    transform: { flipX, flipY, rotate, scale, x, y },
    ...overrides,
  };

  const { result, unmount } = renderHook(() => useFlipTransition(options));
  return { onClosed, result, scale, source, unmount, x, y };
};

const bindImage = (result: { current: ReturnType<typeof useFlipTransition> }) => {
  const parent = document.createElement('div');
  const node = document.createElement('img');
  parent.append(node);
  document.body.append(parent);
  act(() => {
    result.current.imageRef(node);
  });
  return { node, parent };
};

beforeEach(() => {
  vi.useFakeTimers();
  motionMock.pending.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('close', () => {
  it('calls onClosed once all three close-axis animations settle normally', () => {
    const { onClosed, result } = setup();
    flushAnimations();

    act(() => {
      result.current.close();
    });
    flushAnimations();

    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it('still calls onClosed exactly once when a close-axis animation is cancelled by another animate() on the same value', () => {
    const { onClosed, result, scale } = setup();
    flushAnimations();

    act(() => {
      result.current.close();
    });

    // Simulate a future caller (e.g. an ungated refit) animating the same
    // motion value while close is in flight, cancelling close's scale
    // animation before it can fire its onComplete.
    act(() => {
      animate(scale, 1, { type: 'spring' });
    });
    flushAnimations();

    expect(onClosed).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it('never calls onClosed twice when the fallback timer fires after natural completion', () => {
    const { onClosed, result } = setup();
    flushAnimations();

    act(() => {
      result.current.close();
    });
    flushAnimations();
    expect(onClosed).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onClosed).toHaveBeenCalledTimes(1);
  });
});

describe('isTransitioning', () => {
  it('is true while opening and false once the open settles', () => {
    const { result } = setup();
    expect(result.current.isTransitioning()).toBe(true);

    flushAnimations();
    expect(result.current.isTransitioning()).toBe(false);
  });

  it('is true while closing and false once it settles', () => {
    const { result } = setup();
    flushAnimations();
    expect(result.current.isTransitioning()).toBe(false);

    act(() => {
      result.current.close();
    });
    expect(result.current.isTransitioning()).toBe(true);

    flushAnimations();
    expect(result.current.isTransitioning()).toBe(false);
  });

  it('recovers to false via the fallback timer even if the open spring is cancelled', () => {
    const { result, scale } = setup();
    expect(result.current.isTransitioning()).toBe(true);

    act(() => {
      animate(scale, 1, { type: 'spring' });
    });
    flushAnimations();
    expect(result.current.isTransitioning()).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.isTransitioning()).toBe(false);
  });

  it('does not let a stale open fallback fire during a later switch that supersedes it', () => {
    const { result } = setup();
    expect(result.current.isTransitioning()).toBe(true);

    // Interrupt the open before it settles (a fast gallery switch), partway
    // through the open's own fallback window. switchTo's stopAll() should
    // clear the now-orphaned open fallback along with the open's animations.
    act(() => {
      vi.advanceTimersByTime(100);
      result.current.switchTo(() => {});
    });
    expect(result.current.isTransitioning()).toBe(true);

    // Advance to exactly where the superseded open fallback would have
    // fired (t=1000) — well before the switch's own fallback mark (t=1100).
    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(result.current.isTransitioning()).toBe(true);
  });
});

describe('switchTo slide', () => {
  it('applies immediately, jumps the incoming image a viewport width out, and removes the ghost on settle', () => {
    const { result, x } = setup();
    flushAnimations();
    const { parent } = bindImage(result);

    const apply = vi.fn();
    act(() => {
      result.current.switchTo(apply, 1);
    });

    expect(apply).toHaveBeenCalledTimes(1);
    expect(x.get()).toBe(1024);
    const ghost = parent.querySelector<HTMLElement>('[data-ghost]');
    expect(ghost).not.toBeNull();
    expect(ghost?.style.pointerEvents).toBe('none');
    expect(ghost?.getAttribute('aria-hidden')).toBe('true');
    expect(result.current.isTransitioning()).toBe(true);

    flushAnimations();
    expect(x.get()).toBe(0);
    expect(parent.querySelector('[data-ghost]')).toBeNull();
    expect(result.current.isTransitioning()).toBe(false);
  });

  it('mirrors the jump for a prev switch', () => {
    const { result, x } = setup();
    flushAnimations();
    bindImage(result);

    act(() => {
      result.current.switchTo(() => {}, -1);
    });
    expect(x.get()).toBe(-1024);

    flushAnimations();
    expect(x.get()).toBe(0);
  });

  it('composes the slide offset on top of the captured outgoing transform', () => {
    const { result, scale } = setup();
    flushAnimations();
    const { parent } = bindImage(result);

    act(() => {
      scale.set(2);
    });
    act(() => {
      result.current.switchTo(() => {}, 1);
    });

    const ghost = parent.querySelector<HTMLElement>('[data-ghost]');
    const base = ghost?.style.transform ?? '';
    expect(base).toContain('scale(2)');

    flushAnimations();
    expect(ghost?.style.transform).toBe(`translateX(-1024px) ${base}`);
  });

  it('a second switch removes the in-flight ghost and leaves exactly one', () => {
    const { result } = setup();
    flushAnimations();
    const { parent } = bindImage(result);

    act(() => {
      result.current.switchTo(() => {}, 1);
    });
    const first = parent.querySelector('[data-ghost]');

    act(() => {
      result.current.switchTo(() => {}, 1);
    });
    const ghosts = parent.querySelectorAll('[data-ghost]');
    expect(ghosts).toHaveLength(1);
    expect(ghosts[0]).not.toBe(first);

    flushAnimations();
    expect(parent.querySelectorAll('[data-ghost]')).toHaveLength(0);
  });

  it('close removes an in-flight ghost immediately', () => {
    const { result } = setup();
    flushAnimations();
    const { parent } = bindImage(result);

    act(() => {
      result.current.switchTo(() => {}, 1);
    });
    expect(parent.querySelector('[data-ghost]')).not.toBeNull();

    act(() => {
      result.current.close();
    });
    expect(parent.querySelector('[data-ghost]')).toBeNull();
  });

  it('the fallback timer removes a ghost whose animations never complete', () => {
    const { result } = setup();
    flushAnimations();
    const { parent } = bindImage(result);

    act(() => {
      result.current.switchTo(() => {}, 1);
    });
    expect(parent.querySelector('[data-ghost]')).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(parent.querySelector('[data-ghost]')).toBeNull();
    expect(result.current.isTransitioning()).toBe(false);
  });

  it('falls back to the deferred fade swap without a direction', () => {
    const { result } = setup();
    flushAnimations();
    const { parent } = bindImage(result);

    const apply = vi.fn();
    act(() => {
      result.current.switchTo(apply);
    });
    expect(parent.querySelector('[data-ghost]')).toBeNull();
    expect(apply).not.toHaveBeenCalled();

    flushAnimations();
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('keeps the fade path when animated is false even with a direction', () => {
    const { result } = setup({ animated: false });
    flushAnimations();
    const { parent } = bindImage(result);

    const apply = vi.fn();
    act(() => {
      result.current.switchTo(apply, 1);
    });
    expect(parent.querySelector('[data-ghost]')).toBeNull();
    expect(apply).not.toHaveBeenCalled();

    flushAnimations();
    expect(apply).toHaveBeenCalledTimes(1);
  });
});
