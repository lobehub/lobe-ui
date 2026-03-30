import { describe, expect, it } from 'vitest';

import { resolveBlockAnimationMeta } from './streamAnimationMeta';

describe('resolveBlockAnimationMeta', () => {
  it('keeps the current charDelay for active blocks', () => {
    const result = resolveBlockAnimationMeta({
      blockCharCount: 8,
      currentCharDelay: 18,
      fadeDuration: 280,
      previousCharDelay: 12,
      state: 'streaming',
      timelineElapsedMs: 64,
    });

    expect(result.charDelay).toBe(18);
    expect(result.settled).toBe(false);
    expect(result.timelineElapsedMs).toBe(64);
  });

  it('preserves the previous charDelay for revealed blocks still fading', () => {
    const result = resolveBlockAnimationMeta({
      blockCharCount: 5,
      currentCharDelay: 10,
      fadeDuration: 280,
      previousCharDelay: 20,
      state: 'revealed',
      timelineElapsedMs: 320,
    });

    expect(result.charDelay).toBe(20);
    expect(result.settled).toBe(false);
    expect(result.timelineElapsedMs).toBe(320);
  });

  it('freezes revealed blocks after the fade window completes', () => {
    const result = resolveBlockAnimationMeta({
      blockCharCount: 5,
      currentCharDelay: 10,
      fadeDuration: 280,
      previousCharDelay: 20,
      state: 'revealed',
      timelineElapsedMs: 480,
    });

    expect(result.charDelay).toBe(20);
    expect(result.settled).toBe(true);
    expect(result.timelineElapsedMs).toBe(360);
  });
});
