import { describe, expect, it } from 'vitest';

import {
  MAX_AUTO_STREAM_ANIMATION_DURATION_MS,
  resolveStreamAnimationDurationMs,
} from './streamAnimation';

describe('resolveStreamAnimationDurationMs', () => {
  it('should respect manual duration when provided', () => {
    expect(resolveStreamAnimationDurationMs(200, 320)).toBe(320);
  });

  it('should derive duration from stream window by default', () => {
    expect(resolveStreamAnimationDurationMs(100)).toBe(180);
    expect(resolveStreamAnimationDurationMs(200)).toBe(360);
  });

  it('should clamp auto duration to configured max', () => {
    expect(resolveStreamAnimationDurationMs(500)).toBe(MAX_AUTO_STREAM_ANIMATION_DURATION_MS);
  });
});
