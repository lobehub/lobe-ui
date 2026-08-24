import { describe, expect, it } from 'vitest';

import { resolveBlockAnimationMeta } from './streamAnimationMeta';

describe('resolveBlockAnimationMeta', () => {
  it('keeps the current charDelay for active blocks', () => {
    const result = resolveBlockAnimationMeta({
      currentCharDelay: 18,
      fadeDuration: 280,
      lastElapsedMs: 64,
      previousCharDelay: 12,
      state: 'streaming',
    });

    expect(result.charDelay).toBe(18);
    expect(result.settled).toBe(false);
  });

  it('preserves the previous charDelay for revealed blocks still fading', () => {
    const result = resolveBlockAnimationMeta({
      currentCharDelay: 10,
      fadeDuration: 280,
      lastElapsedMs: 200,
      previousCharDelay: 20,
      state: 'revealed',
    });

    expect(result.charDelay).toBe(20);
    expect(result.settled).toBe(false);
  });

  it('settles revealed blocks after the fade window completes', () => {
    const result = resolveBlockAnimationMeta({
      currentCharDelay: 10,
      fadeDuration: 280,
      lastElapsedMs: 320,
      previousCharDelay: 20,
      state: 'revealed',
    });

    expect(result.charDelay).toBe(20);
    expect(result.settled).toBe(true);
  });
});
