import { act, renderHook } from '@testing-library/react';

import { useStreamMermaid } from './useStreamMermaid';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const settle = () => act(() => vi.runAllTimers());

describe('useStreamMermaid', () => {
  it('keeps the last good diagram while the next chunk is still invalid', () => {
    const { result, rerender } = renderHook(({ content }) => useStreamMermaid(content), {
      initialProps: { content: 'flowchart LR\n  A --> B' },
    });
    settle();
    const good = result.current.svg;
    expect(good).toContain('<svg');

    rerender({ content: 'flowchart LR\n  A --> B\n  B --> C{Is i' });
    settle();

    expect(result.current.error).toBeUndefined();
    expect(result.current.svg).toBe(good);
  });

  it('stays pending instead of erroring before the first valid prefix', () => {
    const { result } = renderHook(() => useStreamMermaid('flowchart TD\n  A[Sta'));
    settle();

    expect(result.current).toEqual({ loading: true, svg: '' });
  });

  it('renders while chunks keep arriving faster than the throttle window', () => {
    const source = 'flowchart LR\n  A --> B\n  B --> C\n  C --> D\n  D --> E';
    const { result, rerender } = renderHook(({ content }) => useStreamMermaid(content), {
      initialProps: { content: '' },
    });

    for (let end = 1; end <= source.length; end++) {
      rerender({ content: source.slice(0, end) });
      act(() => vi.advanceTimersByTime(40));
    }

    expect(result.current.svg).toContain('<svg');
  });
});
