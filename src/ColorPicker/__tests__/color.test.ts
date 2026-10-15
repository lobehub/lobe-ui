import { formatColor, normalizeHexInput, parseColor } from '../color';

describe('colour model', () => {
  test('hex round trips', () => {
    expect(formatColor(parseColor('#0072f5'), false)).toBe('#0072f5');
    expect(formatColor(parseColor('#0072f5cc'), true)).toBe('#0072f5cc');
  });

  test('alpha off drops the alpha channel', () => {
    expect(formatColor(parseColor('#0072f5cc'), false)).toBe('#0072f5');
  });

  test('greys keep the fallback hue', () => {
    expect(parseColor('#808080', 200).h).toBe(200);
    expect(parseColor('#000000', 40).h).toBe(40);
  });

  test('invalid input falls back to black with the fallback hue', () => {
    expect(parseColor('nope', 12)).toEqual({ a: 1, h: 12, s: 0, v: 0 });
  });

  test('normalizeHexInput accepts 3, 6 and 8 digits with or without #', () => {
    expect(normalizeHexInput('0072F5')).toBe('#0072f5');
    expect(normalizeHexInput('#fff')).toBe('#fff');
    expect(normalizeHexInput('0072f5cc')).toBe('#0072f5cc');
    expect(normalizeHexInput('zzz')).toBeNull();
  });
});
