import { describe, expect, it } from 'vitest';

import {
  NORMATIVE_MODIFIER,
  checkIsAppleDevice,
  combineKeys,
  splitKeysByPlus,
  startCase,
} from './utils';

const mockUserAgent = (agent: string) => {
  // @ts-ignore
  global.navigator = {
    userAgent: agent,
  };
};

describe('splitKeysByPlus', () => {
  it('should split keys by plus sign', () => {
    expect(splitKeysByPlus('Ctrl+A')).toEqual(['Ctrl', 'A']);
    expect(splitKeysByPlus('Shift+Ctrl+B')).toEqual(['Ctrl', 'Shift', 'B']);
  });

  it('should handle consecutive plus signs', () => {
    expect(splitKeysByPlus('Ctrl++')).toEqual(['Ctrl', 'equal']);
    expect(splitKeysByPlus('Shift+++')).toEqual(['Shift', 'equal', '']);
  });

  it('should sort keys correctly', () => {
    const shortcutsA = 'Ctrl+Shift+Alt+Y';
    const shortcutsB = 'Ctrl+Alt+Shift+Y';

    expect(splitKeysByPlus(shortcutsA)).toEqual(['Ctrl', 'Alt', 'Shift', 'Y']);

    expect(splitKeysByPlus(shortcutsA)).toEqual(splitKeysByPlus(shortcutsB));
  });
});

describe('startCase', () => {
  it('should convert string to start case', () => {
    expect(startCase('helloWorld')).toBe('Hello World');
    expect(startCase('hello_world')).toBe('Hello_world');
    expect(startCase('HelloWorld')).toBe('Hello World');
  });

  it('should handle empty string', () => {
    expect(startCase('')).toBe('');
  });
});

describe('checkIsAppleDevice', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    // @ts-ignore
    global.navigator = originalNavigator;
  });

  it('should return provided isApple value when defined', () => {
    expect(checkIsAppleDevice(true)).toBe(true);
    expect(checkIsAppleDevice(false)).toBe(false);
  });

  it('should detect Apple device from user agent', () => {
    mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');
    expect(checkIsAppleDevice()).toBe(true);

    mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
    expect(checkIsAppleDevice()).toBe(true);

    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    expect(checkIsAppleDevice()).toBe(false);
  });

  it('should handle SSR environment', () => {
    // @ts-ignore
    global.navigator = undefined;
    expect(checkIsAppleDevice()).toBe(false);
  });
});

// 规范化顺序
describe('NORMATIVE_MODIFIER', () => {
  it('should be in the correct order', () => {
    const expectedOrder = ['ctrl', 'control', 'meta', 'mod', 'alt', 'shift'];
    expect(NORMATIVE_MODIFIER).toEqual(expectedOrder);
  });
});

describe('combineKeys', () => {
  it('should combine keys with plus sign', () => {
    expect(combineKeys(['Ctrl', 'A'])).toBe('Ctrl+A');
    expect(combineKeys(['Shift', 'Ctrl', 'B'])).toBe('Shift+Ctrl+B');
  });

  it('should handle empty array', () => {
    expect(combineKeys([])).toBe('');
  });
});
