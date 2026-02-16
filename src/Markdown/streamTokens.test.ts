import { describe, expect, it } from 'vitest';

import { countStreamAnimationChars, splitStreamAnimationChars } from './streamTokens';

const hasIntlSegmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl;

describe('streamTokens', () => {
  it('should keep special emoji sequences as single animation chars', () => {
    const text = 'A👨‍👩‍👧‍👦B👍🏽🇨🇳';

    if (!hasIntlSegmenter) {
      expect(splitStreamAnimationChars(text)).toEqual(Array.from(text));
      return;
    }

    expect(splitStreamAnimationChars(text)).toEqual(['A', '👨‍👩‍👧‍👦', 'B', '👍🏽', '🇨🇳']);
  });

  it('should ignore whitespace chars when counting animation chars', () => {
    expect(countStreamAnimationChars('👨‍👩‍👧‍👦  👍🏽')).toBe(2);
  });
});
