import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { springScrollTo, springScrollToElement, springScrollToTop } from './scroller';

beforeEach(() => {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 120,
    writable: true,
  });
  Object.defineProperty(document.documentElement, 'scrollTop', {
    configurable: true,
    value: 120,
    writable: true,
  });
  Object.defineProperty(document.body, 'scrollTop', {
    configurable: true,
    value: 0,
    writable: true,
  });
  vi.spyOn(window, 'scrollTo').mockImplementation((...args: unknown[]) => {
    const y =
      typeof args[0] === 'number'
        ? args[1]
        : ((args[0] as ScrollToOptions | undefined)?.top ?? 0);
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: y,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      configurable: true,
      value: y,
      writable: true,
    });
  });
  vi.spyOn(window, 'addEventListener');
  vi.spyOn(window, 'removeEventListener');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('springScrollTo', () => {
  it('animates window scroll and stops on wheel', () => {
    const animation = springScrollTo(40);
    expect(window.addEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), {
      passive: true,
    });
    expect(window.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), {
      passive: true,
    });
    animation.stop();
  });

  it('starts from the current scroll position on the first frame', () => {
    let frames = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frames += 1;
      if (frames === 1) cb(16);
      return frames;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    const animation = springScrollTo(400);

    expect(window.scrollTo).toHaveBeenCalled();
    const firstCall = (window.scrollTo as ReturnType<typeof vi.fn>).mock.calls[0];
    const y = typeof firstCall[0] === 'number' ? firstCall[1] : firstCall[0]?.top;
    expect(y).toBe(120);

    animation.stop();
  });
});

describe('springScrollToTop', () => {
  it('returns an animation handle', () => {
    const animation = springScrollToTop();
    expect(animation).toHaveProperty('stop');
    animation.stop();
  });
});

describe('springScrollToElement', () => {
  it('targets element offset plus delta', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'offsetTop', { value: 200 });
    Object.defineProperty(element, 'offsetParent', { value: null });

    const animation = springScrollToElement(element, -100);
    expect(animation).toHaveProperty('stop');
    animation.stop();
  });
});
