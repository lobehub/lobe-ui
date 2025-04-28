import { describe, expect, it, vi } from 'vitest';

import { formatTime } from './formatTime';

describe('formatTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should format time for same day', () => {
    const now = new Date('2025-03-15T10:30:00');
    vi.setSystemTime(now);

    const time = new Date('2025-03-15T08:15:30').getTime();
    expect(formatTime(time)).toBe('08:15:30');
  });

  it('should format time for same year but different day', () => {
    const now = new Date('2025-03-15T10:30:00');
    vi.setSystemTime(now);

    const time = new Date('2025-02-14T08:15:30').getTime();
    expect(formatTime(time)).toBe('02-14 08:15:30');
  });

  it('should format time for different year', () => {
    const now = new Date('2025-03-15T10:30:00');
    vi.setSystemTime(now);

    const time = new Date('2024-12-31T23:59:59').getTime();
    expect(formatTime(time)).toBe('2024-12-31 23:59:59');
  });

  it('should handle edge cases around midnight', () => {
    const now = new Date('2025-03-15T00:00:00');
    vi.setSystemTime(now);

    const time = new Date('2025-03-14T23:59:59').getTime();
    expect(formatTime(time)).toBe('03-14 23:59:59');
  });

  it('should handle edge cases around year change', () => {
    const now = new Date('2025-01-01T00:00:00');
    vi.setSystemTime(now);

    const time = new Date('2024-12-31T23:59:59').getTime();
    expect(formatTime(time)).toBe('2024-12-31 23:59:59');
  });
});
