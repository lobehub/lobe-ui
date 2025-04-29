import { afterEach, describe, expect, it } from 'vitest';

import { checkIsAppleDevice, combineKeys, splitKeysByPlus, startCase } from '../src/Hotkey/utils';

describe('Hotkey utils', () => {
  describe('splitKeysByPlus', () => {
    it('should split keys by plus sign', () => {
      expect(splitKeysByPlus('ctrl+a')).toEqual(['ctrl', 'a']);
    });

    it('should handle double plus signs', () => {
      expect(splitKeysByPlus('ctrl++')).toEqual(['ctrl', 'equal']);
    });

    it('should sort modifier keys in normative order', () => {
      expect(splitKeysByPlus('shift+ctrl+a')).toEqual(['ctrl', 'shift', 'a']);
      expect(splitKeysByPlus('meta+alt+shift+ctrl+a')).toEqual([
        'ctrl',
        'alt',
        'shift',
        'meta',
        'a',
      ]);
    });

    it('should handle uppercase keys', () => {
      expect(splitKeysByPlus('CTRL+SHIFT+A')).toEqual(['CTRL', 'SHIFT', 'A']);
    });

    it('should handle multiple non-modifier keys', () => {
      expect(splitKeysByPlus('ctrl+a+b+c')).toEqual(['ctrl', 'a', 'b', 'c']);
    });
  });

  describe('startCase', () => {
    it('should convert string to start case', () => {
      expect(startCase('helloWorld')).toBe('Hello World');
      expect(startCase('hello-world')).toBe('Hello-world');
      expect(startCase('HelloWorld')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(startCase('')).toBe('');
    });

    it('should handle single word', () => {
      expect(startCase('hello')).toBe('Hello');
    });
  });

  describe('checkIsAppleDevice', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      // @ts-ignore
      global.navigator = originalNavigator;
    });

    it('should return provided boolean value if specified', () => {
      expect(checkIsAppleDevice(true)).toBe(true);
      expect(checkIsAppleDevice(false)).toBe(false);
    });

    it('should detect Apple device from userAgent', () => {
      // @ts-ignore
      global.navigator = {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      };
      expect(checkIsAppleDevice()).toBe(true);

      // @ts-ignore
      global.navigator = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      };
      expect(checkIsAppleDevice()).toBe(false);
    });

    it('should detect iOS devices', () => {
      // @ts-ignore
      global.navigator = {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      };
      expect(checkIsAppleDevice()).toBe(true);
    });

    it('should return false in SSR environment', () => {
      // @ts-ignore
      global.navigator = undefined;
      expect(checkIsAppleDevice()).toBe(false);
    });
  });

  describe('combineKeys', () => {
    it('should combine keys with plus sign', () => {
      expect(combineKeys(['ctrl', 'shift', 'a'])).toBe('ctrl+shift+a');
      expect(combineKeys(['meta', 'x'])).toBe('meta+x');
    });

    it('should handle empty array', () => {
      expect(combineKeys([])).toBe('');
    });

    it('should handle single key', () => {
      expect(combineKeys(['a'])).toBe('a');
    });

    it('should preserve case sensitivity', () => {
      expect(combineKeys(['Ctrl', 'Shift', 'A'])).toBe('Ctrl+Shift+A');
    });
  });
});
