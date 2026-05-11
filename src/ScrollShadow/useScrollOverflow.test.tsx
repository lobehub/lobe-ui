import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollOverflow } from './useScrollOverflow';

class ResizeObserverMock {
  disconnect = vi.fn();
  observe = vi.fn();
}

const createScrollElement = ({
  clientHeight = 100,
  clientWidth = 100,
  scrollHeight = 100,
  scrollLeft = 0,
  scrollTop = 0,
  scrollWidth = 100,
} = {}) => {
  const element = document.createElement('div');

  Object.defineProperties(element, {
    clientHeight: { configurable: true, value: clientHeight },
    clientWidth: { configurable: true, value: clientWidth },
    scrollHeight: { configurable: true, value: scrollHeight },
    scrollLeft: { configurable: true, value: scrollLeft, writable: true },
    scrollTop: { configurable: true, value: scrollTop, writable: true },
    scrollWidth: { configurable: true, value: scrollWidth },
  });

  return element;
};

describe('useScrollOverflow', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('does not update state or notify when measured visibility is unchanged', async () => {
    const onVisibilityChange = vi.fn();
    const renderSpy = vi.fn();
    const domRef = { current: createScrollElement() };

    renderHook(() => {
      renderSpy();

      return useScrollOverflow({
        domRef,
        onVisibilityChange,
      });
    });

    await Promise.resolve();

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(onVisibilityChange).not.toHaveBeenCalled();
  });
});
