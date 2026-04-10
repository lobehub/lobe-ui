import { clamp, dampenValue, resolveSize } from '../helpers';

describe('clamp', () => {
  test('clamps value below min', () => {
    expect(clamp(50, 100, 500)).toBe(100);
  });

  test('clamps value above max', () => {
    expect(clamp(600, 100, 500)).toBe(500);
  });

  test('returns value within range', () => {
    expect(clamp(300, 100, 500)).toBe(300);
  });
});

describe('dampenValue', () => {
  test('returns 0 for input 0', () => {
    expect(dampenValue(0)).toBeCloseTo(8 * (Math.log(1) - 2));
  });

  test('increases logarithmically', () => {
    const a = dampenValue(10);
    const b = dampenValue(100);
    expect(b).toBeGreaterThan(a);
    // Logarithmic: 10x input should not produce 10x output
    expect(b / a).toBeLessThan(10);
  });
});

describe('resolveSize', () => {
  test('fraction (0-1) resolves to percentage of container', () => {
    expect(resolveSize(0.5, 800)).toBe(400);
  });

  test('value > 1 treated as pixels', () => {
    expect(resolveSize(200, 800)).toBe(200);
  });

  test('value of exactly 1 treated as 100%', () => {
    expect(resolveSize(1, 800)).toBe(800);
  });

  test('value of 0 returns 0', () => {
    expect(resolveSize(0, 800)).toBe(0);
  });
});
