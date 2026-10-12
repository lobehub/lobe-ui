import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useControlledState } from './useControlledState';

describe('useControlledState', () => {
  it('starts from defaultValue, then the positional default', () => {
    expect(renderHook(() => useControlledState(1, { defaultValue: 2 })).result.current[0]).toBe(2);
    expect(renderHook(() => useControlledState(1)).result.current[0]).toBe(1);
    expect(renderHook(() => useControlledState(() => 3)).result.current[0]).toBe(3);
    expect(
      renderHook(() => useControlledState(1, { defaultValue: () => 4 })).result.current[0],
    ).toBe(4);
  });

  it('updates internal state when uncontrolled and reports changes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControlledState<string>('a', { onChange }));
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b', 'a');
  });

  it('does not report a change to the same value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControlledState<string>('a', { onChange }));
    act(() => result.current[1]('a'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('follows the controlled value and ignores internal state', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControlledState('x', { onChange, value }),
      { initialProps: { value: 'controlled' } },
    );
    act(() => result.current[1]('next'));
    expect(result.current[0]).toBe('controlled');
    expect(onChange).toHaveBeenCalledWith('next', 'controlled');
    rerender({ value: 'from parent' });
    expect(result.current[0]).toBe('from parent');
  });

  it('falls back to the last internal value when value becomes undefined', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value?: string }) => useControlledState('x', { value }),
      { initialProps: { value: 'controlled' as string | undefined } },
    );
    act(() => result.current[1]('typed'));
    rerender({ value: undefined });
    expect(result.current[0]).toBe('typed');
  });
});
