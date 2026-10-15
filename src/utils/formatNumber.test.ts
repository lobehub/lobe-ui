import { describe, expect, it } from 'vitest';

import { formatNumber } from './formatNumber';

describe('formatNumber', () => {
  it('groups thousands with commas', () => {
    expect(formatNumber(1_234_567)).toBe('1,234,567');
  });

  it('rounds to a whole number', () => {
    expect(formatNumber(1234.5)).toBe('1,235');
  });

  it('leaves small integers unchanged', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });
});
