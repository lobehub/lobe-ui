import { describe, expect, it } from 'vitest';

import { isDeepEqual } from './isDeepEqual';

describe('isDeepEqual', () => {
  it('treats identical primitives as equal', () => {
    expect(isDeepEqual(1, 1)).toBe(true);
    expect(isDeepEqual('a', 'a')).toBe(true);
    expect(isDeepEqual(undefined, undefined)).toBe(true);
    expect(isDeepEqual(null, null)).toBe(true);
  });

  it('treats different primitives as not equal', () => {
    expect(isDeepEqual(1, 2)).toBe(false);
    expect(isDeepEqual('a', 'b')).toBe(false);
    expect(isDeepEqual(null, undefined)).toBe(false);
    expect(isDeepEqual(0, '0')).toBe(false);
  });

  it('treats structurally identical objects as equal across refs', () => {
    expect(isDeepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
  });

  it('detects different object shapes', () => {
    expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isDeepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('compares arrays structurally', () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isDeepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(isDeepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
  });

  it('compares functions by reference', () => {
    const fn = () => 1;
    expect(isDeepEqual(fn, fn)).toBe(true);
    expect(
      isDeepEqual(
        () => 1,
        () => 1,
      ),
    ).toBe(false);
  });

  it('handles mixed object+array nesting', () => {
    expect(
      isDeepEqual(
        { html: { theme: 'dark', defaultHeight: 1080 } },
        { html: { theme: 'dark', defaultHeight: 1080 } },
      ),
    ).toBe(true);
  });
});
