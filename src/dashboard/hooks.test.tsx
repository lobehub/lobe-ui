import { act, renderHook } from '@testing-library/react';

import { useLocalStorage } from './hooks';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('lazily reads the stored value on the first render', () => {
    window.localStorage.setItem('nav', JSON.stringify({ guides: false }));
    const seen: unknown[] = [];

    renderHook(() => {
      const [value] = useLocalStorage<Record<string, boolean>>('nav', {});
      seen.push(value);
      return value;
    });

    expect(seen[0]).toEqual({ guides: false });
  });

  it('falls back to the default when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('missing', { open: true }));
    expect(result.current[0]).toEqual({ open: true });
  });

  it('persists updates and keeps interactive toggles working', () => {
    const { result } = renderHook(() => useLocalStorage<Record<string, boolean>>('nav', {}));

    act(() => {
      result.current[1]({ guides: false });
    });

    expect(result.current[0]).toEqual({ guides: false });
    expect(window.localStorage.getItem('nav')).toBe(JSON.stringify({ guides: false }));
  });

  it('stays in memory when no key is provided', () => {
    const { result } = renderHook(() => useLocalStorage<number>(undefined, 1));

    act(() => {
      result.current[1](2);
    });

    expect(result.current[0]).toBe(2);
    expect(window.localStorage.length).toBe(0);
  });
});
