import { describe, expect, it } from 'vitest';

import { hashString } from './hashString';

describe('hashString', () => {
  it('returns the same hash for the same input', () => {
    expect(hashString('const a = 1;')).toBe(hashString('const a = 1;'));
  });

  it('returns different hashes for inputs that differ by one character', () => {
    const base = 'x'.repeat(20_000);
    expect(hashString(`${base}a`)).not.toBe(hashString(`${base}b`));
  });

  it('has no collisions across many short distinct inputs', () => {
    const hashes = new Set(
      Array.from({ length: 50_000 }, (_, index) => hashString(`line ${index}`)),
    );
    expect(hashes.size).toBe(50_000);
  });
});
