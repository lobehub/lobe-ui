import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useWindowedStreamContent } from './useWindowedStreamContent';

describe('useWindowedStreamContent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should batch append updates within the same time window', () => {
    const { result, rerender } = renderHook(
      ({ content }) => useWindowedStreamContent(content, 200),
      {
        initialProps: { content: 'A' },
      },
    );

    expect(result.current).toBe('A');

    rerender({ content: 'AB' });
    expect(result.current).toBe('A');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ content: 'ABC' });
    expect(result.current).toBe('A');

    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(result.current).toBe('A');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('ABC');
  });

  it('should apply non-append updates immediately', () => {
    const { result, rerender } = renderHook(
      ({ content }) => useWindowedStreamContent(content, 200),
      {
        initialProps: { content: 'ABCDE' },
      },
    );

    rerender({ content: 'ABZDE' });
    expect(result.current).toBe('ABZDE');
  });

  it('should bypass windowing when window is disabled', () => {
    const { result, rerender } = renderHook(({ content }) => useWindowedStreamContent(content, 0), {
      initialProps: { content: 'A' },
    });

    rerender({ content: 'AB' });
    expect(result.current).toBe('AB');
  });
});
