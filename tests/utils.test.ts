import { describe, expect, it } from 'vitest';

import { checkIsAppleDevice, splitKeysByPlus, startCase } from '../src/Hotkey/utils';

describe('splitKeysByPlus', () => {
  it('should split keys by plus sign', () => {
    expect(splitKeysByPlus('ctrl+alt')).toEqual(['ctrl', 'alt']);
    expect(splitKeysByPlus('ctrl++')).toEqual(['ctrl', '+']);
    expect(splitKeysByPlus('ctrl+alt++')).toEqual(['ctrl', 'alt', '+']);
    expect(splitKeysByPlus('ctrl+PLACEHOLDER+alt')).toEqual(['ctrl', '+', 'alt']);
    expect(splitKeysByPlus('+++')).toEqual(['+']);
  });

  it('should handle empty strings', () => {
    expect(splitKeysByPlus('')).toEqual([]);
  });

  it('should handle strings without plus', () => {
    expect(splitKeysByPlus('ctrl')).toEqual(['ctrl']);
  });
});

describe('startCase', () => {
  it('should convert string to start case', () => {
    expect(startCase('fooBar')).toBe('Foo Bar');
    expect(startCase('foo_bar')).toBe('Foo_bar');
    expect(startCase('fooBarBaz')).toBe('Foo Bar Baz');
    expect(startCase('FooBarBaz')).toBe('Foo Bar Baz');
    expect(startCase('foo bar')).toBe('Foo bar');
  });

  it('should handle empty strings', () => {
    expect(startCase('')).toBe('');
  });

  it('should handle single word strings', () => {
    expect(startCase('foo')).toBe('Foo');
  });
});

describe('checkIsAppleDevice', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    // @ts-ignore
    global.navigator = originalNavigator;
  });

  it('should return provided boolean value when isApple is defined', () => {
    expect(checkIsAppleDevice(true)).toBe(true);
    expect(checkIsAppleDevice(false)).toBe(false);
  });

  it('should return false when window/navigator is undefined', () => {
    // @ts-ignore
    delete global.navigator;
    expect(checkIsAppleDevice()).toBe(false);
  });

  it('should detect Apple devices based on userAgent', () => {
    const mockUserAgents = {
      android: 'Mozilla/5.0 (Linux; Android 10)',
      ios: 'Mozilla/5.0 (iOS; CPU OS 14_0 like Mac OS X)',
      ipad: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
      iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      ipod: 'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)',
      mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    };

    // Test Mac
    // @ts-ignore
    global.navigator = { userAgent: mockUserAgents.mac };
    expect(checkIsAppleDevice()).toBe(true);

    // Test iPhone
    // @ts-ignore
    global.navigator = { userAgent: mockUserAgents.iphone };
    expect(checkIsAppleDevice()).toBe(true);

    // Test iPad
    // @ts-ignore
    global.navigator = { userAgent: mockUserAgents.ipad };
    expect(checkIsAppleDevice()).toBe(true);

    // Test iPod
    // @ts-ignore
    global.navigator = { userAgent: mockUserAgents.ipod };
    expect(checkIsAppleDevice()).toBe(true);

    // Test iOS
    // @ts-ignore
    global.navigator = { userAgent: mockUserAgents.ios };
    expect(checkIsAppleDevice()).toBe(true);

    // Test Windows
    // @ts-ignore
    global.navigator = { userAgent: mockUserAgents.windows };
    expect(checkIsAppleDevice()).toBe(false);

    // Test Android
    // @ts-ignore
    global.navigator = { userAgent: mockUserAgents.android };
    expect(checkIsAppleDevice()).toBe(false);
  });
});
