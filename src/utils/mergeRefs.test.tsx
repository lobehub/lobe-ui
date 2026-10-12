import { render, renderHook } from '@testing-library/react';
import type { RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { mergeRefs, useMergeRefs } from './mergeRefs';

describe('mergeRefs', () => {
  it('assigns the node to object refs and callback refs', () => {
    const objectRef: RefObject<HTMLDivElement | null> = { current: null };
    const callbackRef = vi.fn();
    const { container } = render(<div ref={mergeRefs([objectRef, callbackRef, undefined])} />);
    expect(objectRef.current).toBe(container.firstChild);
    expect(callbackRef).toHaveBeenCalledWith(container.firstChild);
  });

  it('clears object refs and runs callback cleanups on unmount', () => {
    const objectRef: RefObject<HTMLDivElement | null> = { current: null };
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);
    const { unmount } = render(<div ref={mergeRefs([objectRef, callbackRef])} />);
    unmount();
    expect(objectRef.current).toBeNull();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('calls callback refs without a cleanup with null on unmount', () => {
    const callbackRef = vi.fn();
    const { unmount } = render(<div ref={mergeRefs([callbackRef])} />);
    unmount();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });
});

describe('useMergeRefs', () => {
  it('returns the same ref while the inputs are unchanged', () => {
    const a: RefObject<HTMLDivElement | null> = { current: null };
    const b: RefObject<HTMLDivElement | null> = { current: null };
    const { result, rerender } = renderHook(({ refs }) => useMergeRefs(refs), {
      initialProps: { refs: [a, b] },
    });
    const first = result.current;
    rerender({ refs: [a, b] });
    expect(result.current).toBe(first);
    rerender({ refs: [b, a] });
    expect(result.current).not.toBe(first);
  });
});
