import { describe, expect, it } from 'vitest';

import { buildTocPath } from './tocPath';

const row = (index: number, level: 2 | 3, height = 30) => ({
  bottom: index * height + height,
  level,
  top: index * height,
});

describe('buildTocPath', () => {
  it('returns an empty path for no rows', () => {
    expect(buildTocPath([])).toEqual({ d: '', length: 0, ranges: [] });
  });

  it('draws one straight track when every row shares a level', () => {
    const path = buildTocPath([row(0, 2), row(1, 2)]);

    expect(path.d).toBe('M1 6 L1 24 L1 36 L1 54');
    expect(path.length).toBe(48);
    expect(path.ranges).toEqual([
      [0, 18],
      [30, 48],
    ]);
  });

  it('rounds the bends where the level changes', () => {
    const path = buildTocPath([row(0, 2), row(1, 3), row(2, 2)]);
    const bendCount = path.d.match(/Q/g)?.length ?? 0;

    expect(bendCount).toBe(4);
    expect(path.d.startsWith('M1 6')).toBe(true);
    expect(path.d).toContain('Q13 36');
  });

  it('is shorter than the sharp polyline it rounds', () => {
    const path = buildTocPath([row(0, 2), row(1, 3)]);
    const sharp = 18 + Math.hypot(12, 12) + 18;

    expect(path.length).toBeLessThan(sharp);
    expect(path.length).toBeGreaterThan(sharp - 4);
  });

  it('keeps every row range inside the path and in document order', () => {
    const path = buildTocPath([row(0, 2), row(1, 3), row(2, 3), row(3, 2)]);

    for (const [index, [start, end]] of path.ranges.entries()) {
      expect(end).toBeGreaterThan(start);
      expect(end).toBeLessThanOrEqual(path.length);
      if (index > 0) expect(start).toBeGreaterThanOrEqual(path.ranges[index - 1][1]);
    }
  });

  it('follows rows of uneven height', () => {
    const path = buildTocPath([
      { bottom: 50, level: 2, top: 0 },
      { bottom: 80, level: 2, top: 50 },
    ]);

    expect(path.d).toBe('M1 6 L1 44 L1 56 L1 74');
    expect(path.ranges).toEqual([
      [0, 38],
      [50, 68],
    ]);
  });
});
