import { act, render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSize } from './useSize';

let observerCallback: ResizeObserverCallback | undefined;
const disconnect = vi.fn();

class FakeResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    observerCallback = callback;
  }
  disconnect = disconnect;
  observe = vi.fn();
  unobserve = vi.fn();
}

const setClientSize = (element: Element, width: number, height: number) => {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: width });
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: height });
};

let latest: { height: number; width: number } | undefined;

const Probe = () => {
  const ref = useRef<HTMLDivElement>(null);
  latest = useSize(ref);
  return <div data-testid="box" ref={ref} />;
};

describe('useSize', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    observerCallback = undefined;
    latest = undefined;
  });

  it('reports the element size and follows resizes', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const spy = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(120);
    const spyH = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(40);
    const { getByTestId, unmount } = render(<Probe />);
    expect(latest).toEqual({ height: 40, width: 120 });

    spy.mockRestore();
    spyH.mockRestore();
    const box = getByTestId('box');
    setClientSize(box, 300, 80);
    act(() => {
      observerCallback?.([{ target: box } as unknown as ResizeObserverEntry], {} as ResizeObserver);
    });
    expect(latest).toEqual({ height: 80, width: 300 });

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
