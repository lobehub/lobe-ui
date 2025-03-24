import { describe, expect, it } from 'vitest';

import { checkIsAppleDevice, splitKeysByPlus, startCase } from '../src/Hotkey/utils';

describe('splitKeysByPlus', () => {
  it('should split keys by plus sign', () => {
    expect(splitKeysByPlus('ctrl+a')).toEqual(['ctrl', 'a']);
    expect(splitKeysByPlus('shift+alt+b')).toEqual(['shift', 'alt', 'b']);
  });

  it('should handle consecutive plus signs', () => {
    expect(splitKeysByPlus('ctrl++')).toEqual(['ctrl', '+']);
    expect(splitKeysByPlus('shift++')).toEqual(['shift', '+']);
  });

  it('should handle empty parts', () => {
    expect(splitKeysByPlus('+')).toEqual([]);
    expect(splitKeysByPlus('')).toEqual([]);
  });

  it('should handle special characters', () => {
    expect(splitKeysByPlus('ctrl+!')).toEqual(['ctrl', '!']);
    expect(splitKeysByPlus('shift+@+#')).toEqual(['shift', '@', '#']);
  });
});

describe('startCase', () => {
  it('should convert string to start case', () => {
    expect(startCase('helloWorld')).toBe('Hello World');
    expect(startCase('thisIsATest')).toBe('This Is A Test');
  });

  it('should handle single word', () => {
    expect(startCase('hello')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(startCase('')).toBe('');
  });

  it('should handle multiple uppercase letters', () => {
    expect(startCase('XMLHttpRequest')).toBe('X M L Http Request');
    expect(startCase('iOSDevice')).toBe('I O S Device'); // Fixed expected value
  });
});

describe('checkIsAppleDevice', () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    // @ts-ignore
    delete global.navigator;
    // @ts-ignore
    global.navigator = {
      userAgent: '',
    };
  });

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  it('should return true for Apple devices', () => {
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
      'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)',
    ];

    for (const ua of userAgents) {
      // @ts-ignore
      global.navigator.userAgent = ua;
      expect(checkIsAppleDevice()).toBe(true);
    }
  });

  it('should return false for non-Apple devices', () => {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Mozilla/5.0 (Linux; Android 10)',
    ];

    for (const ua of userAgents) {
      // @ts-ignore
      global.navigator.userAgent = ua;
      expect(checkIsAppleDevice()).toBe(false);
    }
  });

  it('should respect explicit isApple parameter', () => {
    expect(checkIsAppleDevice(true)).toBe(true);
    expect(checkIsAppleDevice(false)).toBe(false);
  });

  it('should handle SSR environment', () => {
    // @ts-ignore
    delete global.navigator;
    // @ts-ignore
    delete global.window;

    expect(checkIsAppleDevice()).toBe(false);
  });
});
