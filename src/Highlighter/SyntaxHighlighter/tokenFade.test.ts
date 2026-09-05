import type { ThemedToken } from 'shiki';
import { describe, expect, it } from 'vitest';

import { createTokenFadeStore, markTokenBirths, resolveTokenFadeStyle } from './tokenFade';

const token = (content: string): ThemedToken => ({ content, offset: 0 });
const delayAt = (store: ReturnType<typeof createTokenFadeStore>, offset: number, now: number) => {
  const style = resolveTokenFadeStyle(store, offset, now);
  return style === null ? null : Number.parseFloat(style.animationDelay as string);
};

describe('token fade', () => {
  it('chains births per char and freezes a delay per token start', () => {
    const store = createTokenFadeStore();
    const starts = markTokenBirths(store, [[token('const'), token(' '), token('a')]], 1000);

    expect(starts).toEqual([0]);
    expect(store.births).toHaveLength(7);
    expect(delayAt(store, 0, 1000)).toBe(0);
    expect(delayAt(store, 6, 1000)).toBeGreaterThan(delayAt(store, 5, 1000)!);

    const frozen = resolveTokenFadeStyle(store, 6, 1000);
    expect(
      markTokenBirths(store, [[token('const'), token(' '), token('ab')], [token('x')]], 1050),
    ).toEqual([0, 9]);
    expect(resolveTokenFadeStyle(store, 6, 1050)).toBe(frozen);
    expect(store.births).toHaveLength(10);
  });

  it('chars appended to a token inherit its birth', () => {
    const store = createTokenFadeStore();
    markTokenBirths(store, [[token('ab')]], 1000);
    markTokenBirths(store, [[token('abcd')]], 1100);
    expect(store.births[3]).toBe(store.births[0]);
  });

  it('resumes the fade of already visible text when a token is re-split', () => {
    const store = createTokenFadeStore();
    markTokenBirths(store, [[token("'rea")]], 1000);
    markTokenBirths(store, [[token("'"), token('rea'), token("'")]], 1100);

    expect(delayAt(store, 1, 1100)).toBe(-100);
    expect(delayAt(store, 4, 1100)).toBeGreaterThanOrEqual(0);
  });

  it('never fades text that was already shown plain', () => {
    const store = createTokenFadeStore();
    markTokenBirths(store, [[token('a')]], 0);
    markTokenBirths(store, [[token('ab')]], 5000);
    markTokenBirths(store, [[token('a'), token('b')]], 5100);
    expect(resolveTokenFadeStyle(store, 1, 5100)).toBeNull();
  });

  it('a merge then split keeps the older birth', () => {
    const store = createTokenFadeStore();
    markTokenBirths(store, [[token('a'), token('b')]], 0);
    markTokenBirths(store, [[token('ab')]], 50);
    markTokenBirths(store, [[token('a'), token('b')]], 100);
    expect(store.births[1]).toBe(store.births[0]);
  });

  it('caps a burst to the fade window', () => {
    const store = createTokenFadeStore();
    markTokenBirths(store, [Array.from({ length: 200 }, (_, i) => token(`t${i}`))], 0);
    const maxDelay = Math.max(...store.births.map((birth) => birth));
    expect(maxDelay).toBeLessThanOrEqual(16 + 180);
  });
});
