import { describe, expect, it } from 'vitest';

import { mixColors, parseRgb, withAlpha } from './colorMath';

describe('mixColors', () => {
  it.each([
    [0.5, '#ffffff', '#000000', '#7f7f7f'],
    [0.5, '#f8f8f8', '#ffffff', '#fbfbfb'],
    [0.3, '#1677ff', '#000', '#06234c'],
    [0.5, 'rgba(0,0,0,0.88)', '#ffffff', 'rgba(142,142,142,0.94)'],
    [0.5, 'rgba(255,255,255,0.1)', 'rgba(0,0,0,0.5)', 'rgba(76,76,76,0.3)'],
    [0, '#123456', '#abcdef', '#abcdef'],
    [0.5, 'transparent', '#abcdef', '#abcdef'],
    [0.5, '#111', '#333', '#222'],
  ])('mix(%s, %s, %s) = %s', (weight, color, other, expected) => {
    expect(mixColors(weight, color, other)).toBe(expected);
  });
});

describe('withAlpha', () => {
  it.each([
    ['#ff0000', 0.4, 'rgba(255,0,0,0.4)'],
    ['#1677ff', 0.12, 'rgba(22,119,255,0.12)'],
    ['rgba(0,0,0,0.88)', 0.5, 'rgba(0,0,0,0.5)'],
    ['#fff', 1, 'rgba(255,255,255,1)'],
  ])('withAlpha(%s, %s) = %s', (color, alpha, expected) => {
    expect(withAlpha(color, alpha)).toBe(expected);
  });
});

describe('parseRgb', () => {
  it('omits alpha for opaque colors', () => {
    expect(parseRgb('#1677ff')).toEqual({ blue: 255, green: 119, red: 22 });
  });

  it('keeps alpha for translucent colors', () => {
    expect(parseRgb('rgba(0,0,0,0.06)')).toEqual({ alpha: 0.06, blue: 0, green: 0, red: 0 });
  });
});
