import { act, cleanup, render } from '@testing-library/react';

import AnimatedNumber from './AnimatedNumber';

describe('AnimatedNumber', () => {
  let now = 0;
  let queue: FrameRequestCallback[] = [];

  const flushFrame = (advance: number) => {
    now += advance;
    const callbacks = queue;
    queue = [];
    act(() => {
      for (const callback of callbacks) callback(now);
    });
  };

  beforeEach(() => {
    now = 0;
    queue = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      queue.push(callback);
      return queue.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {
      queue = [];
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  test('shows the initial value without counting up from zero', () => {
    const { container } = render(<AnimatedNumber value={12_480} />);
    expect(container.textContent).toBe((12_480).toLocaleString());
    expect(queue).toHaveLength(0);
  });

  test('eases to a new value and lands exactly on it', () => {
    const { container, rerender } = render(<AnimatedNumber duration={100} value={0} />);
    rerender(<AnimatedNumber duration={100} value={1000} />);

    flushFrame(0);
    expect(container.textContent).toBe('0');
    flushFrame(50);
    // easeOutCubic at half time is 87.5% of the way.
    expect(container.textContent).toBe('875');
    flushFrame(50);
    expect(container.textContent).toBe((1000).toLocaleString());
    expect(queue).toHaveLength(0);
  });

  test('a change mid-flight continues from the number on screen', () => {
    const { container, rerender } = render(<AnimatedNumber duration={100} value={0} />);
    rerender(<AnimatedNumber duration={100} value={1000} />);
    flushFrame(0);
    flushFrame(50);
    expect(container.textContent).toBe('875');

    rerender(<AnimatedNumber duration={100} value={0} />);
    flushFrame(0);
    expect(container.textContent).toBe('875');
    flushFrame(100);
    expect(container.textContent).toBe('0');
  });

  test('formatter receives the in-flight value', () => {
    const { container, rerender } = render(
      <AnimatedNumber duration={100} formatter={(value) => `$${value.toFixed(1)}`} value={1} />,
    );
    expect(container.textContent).toBe('$1.0');
    rerender(
      <AnimatedNumber duration={100} formatter={(value) => `$${value.toFixed(1)}`} value={2} />,
    );
    flushFrame(0);
    flushFrame(100);
    expect(container.textContent).toBe('$2.0');
  });

  test('reduced motion and a zero duration update at once', () => {
    const { container, rerender } = render(<AnimatedNumber duration={0} value={1} />);
    rerender(<AnimatedNumber duration={0} value={50} />);
    expect(container.textContent).toBe('50');
    expect(queue).toHaveLength(0);

    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }));
    rerender(<AnimatedNumber duration={500} value={99} />);
    expect(container.textContent).toBe('99');
    expect(queue).toHaveLength(0);
  });
});
