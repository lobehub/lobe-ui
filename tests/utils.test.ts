import { describe, expect, it } from 'vitest';

import { checkIsAppleDevice, splitKeysByPlus, startCase } from '../src/Hotkey/utils';

describe('splitKeysByPlus', () => {
  it('should split keys by plus correctly', () => {
    expect(splitKeysByPlus('ctrl+a')).toEqual(['ctrl', 'a']);
    expect(splitKeysByPlus('shift++')).toEqual(['shift', '+']);
    expect(splitKeysByPlus('ctrl++')).toEqual(['ctrl', '+']);
    expect(splitKeysByPlus('ctrl+shift+a')).toEqual(['ctrl', 'shift', 'a']);
    expect(splitKeysByPlus('+')).toEqual([]);
    expect(splitKeysByPlus('')).toEqual([]);
    expect(splitKeysByPlus('+++')).toEqual(['+']); // Fix expected value
    expect(splitKeysByPlus('a+b+c')).toEqual(['a', 'b', 'c']);
  });
});

describe('startCase', () => {
  it('should format string correctly', () => {
    expect(startCase('helloWorld')).toBe('Hello World');
    expect(startCase('HelloWorld')).toBe('Hello World');
    expect(startCase('hello_world')).toBe('Hello_world');
    expect(startCase('hello')).toBe('Hello');
    expect(startCase('')).toBe('');
    expect(startCase('ABC')).toBe('A B C');
    expect(startCase('camelCaseTest')).toBe('Camel Case Test');
    expect(startCase('multiple   spaces')).toBe('Multiple   spaces'); // Fix expected value
  });
});

describe('checkIsAppleDevice', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    // @ts-ignore
    global.navigator = originalNavigator;
  });

  it('should return provided boolean value when isApple is provided', () => {
    expect(checkIsAppleDevice(true)).toBe(true);
    expect(checkIsAppleDevice(false)).toBe(false);
  });

  it('should return false when window/navigator is undefined', () => {
    // @ts-ignore
    global.navigator = undefined;
    expect(checkIsAppleDevice()).toBe(false);
  });

  it('should detect Apple devices correctly', () => {
    const mockUserAgents = {
      android: 'Mozilla/5.0 (Linux; Android 10) Chrome/91.0.4472.120',
      ipad: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
      iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    };

    for (const [device, userAgent] of Object.entries(mockUserAgents)) {
      // @ts-ignore
      global.navigator = { userAgent };
      const expected = ['ipad', 'iphone', 'mac'].includes(device);
      expect(checkIsAppleDevice()).toBe(expected);
    }
  });
});
