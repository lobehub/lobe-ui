import { genFontFamily, genFontFamilyCode } from './font';

const fonts = (stack: string) => stack.split(',');
const before = (stack: string, a: string, b: string) => {
  const list = fonts(stack);
  expect(list).toContain(a);
  expect(list).toContain(b);
  expect(list.indexOf(a)).toBeLessThan(list.indexOf(b));
};

describe('genFontFamily', () => {
  it('leads with Geist and keeps the SC families as the CJK fallback', () => {
    const stack = genFontFamily();

    expect(fonts(stack)[0]).toBe('Geist');
    before(stack, '"HarmonyOS Sans SC"', 'ui-sans-serif');
    before(stack, 'sans-serif', '"Apple Color Emoji"');
  });

  it('never emits comment markers as font names', () => {
    for (const locale of [undefined, 'zh-CN', 'zh-TW', 'ja-JP']) {
      expect(genFontFamily({ locale })).not.toContain('/*');
      expect(genFontFamilyCode({ locale })).not.toContain('/*');
    }
  });

  it('pairs HarmonyOS Sans with HarmonyOS Sans SC for simplified chinese', () => {
    for (const locale of ['zh', 'zh-CN', 'zh-SG', 'zh-Hans']) {
      const stack = genFontFamily({ locale });

      expect(fonts(stack)[0]).toBe('"HarmonyOS Sans"');
      expect(fonts(stack)).not.toContain('Geist');
      before(stack, '"HarmonyOS Sans SC"', '"PingFang SC"');
    }
  });

  it('keeps traditional chinese on system fonts only', () => {
    for (const locale of ['zh-TW', 'zh-HK', 'zh-MO', 'zh-Hant', 'zh-Hant-TW']) {
      const stack = genFontFamily({ locale });

      expect(stack).not.toContain('HarmonyOS');
      expect(fonts(stack)).not.toContain('Geist');
      before(stack, '"PingFang TC"', '"PingFang SC"');
    }
  });

  it('prefers the hong kong families for zh-HK and zh-MO', () => {
    before(genFontFamily({ locale: 'zh-HK' }), '"PingFang HK"', '"PingFang TC"');
    before(genFontFamily({ locale: 'zh-MO' }), '"PingFang MO"', '"PingFang TC"');
  });

  it('puts the locale CJK families ahead of the SC fallback', () => {
    before(genFontFamily({ locale: 'ja-JP' }), '"Hiragino Sans"', '"HarmonyOS Sans SC"');
    before(genFontFamily({ locale: 'ko-KR' }), '"Apple SD Gothic Neo"', '"HarmonyOS Sans SC"');
  });

  it('adds script families for arabic and persian', () => {
    for (const locale of ['ar', 'fa-IR']) {
      before(genFontFamily({ locale }), '"Noto Sans Arabic"', 'ui-sans-serif');
    }
  });

  it('matches locales case-insensitively and ignores unknown ones', () => {
    expect(genFontFamily({ locale: 'JA-jp' })).toBe(genFontFamily({ locale: 'ja' }));
    expect(genFontFamily({ locale: 'de-DE' })).toBe(genFontFamily());
    expect(genFontFamily({ locale: 'jav' })).toBe(genFontFamily());
  });

  it('prepends custom fonts and leaves composed lists untouched', () => {
    const stack = genFontFamily({ prepend: [' LXGW WenKai ', 'Foo, "Bar Baz"', '', undefined] });

    expect(stack.startsWith('"LXGW WenKai",Foo, "Bar Baz",Geist,')).toBe(true);
  });
});

describe('genFontFamilyCode', () => {
  it('leads with Geist Mono and ends on monospace before emoji', () => {
    const stack = genFontFamilyCode();

    expect(fonts(stack)[0]).toBe('"Geist Mono"');
    before(stack, '"HarmonyOS Sans SC"', 'monospace');
    before(stack, 'monospace', '"Apple Color Emoji"');
  });

  it('uses the locale CJK families for code too', () => {
    before(genFontFamilyCode({ locale: 'ja-JP' }), '"Hiragino Sans"', '"HarmonyOS Sans SC"');
    expect(genFontFamilyCode({ locale: 'zh-TW' })).not.toContain('HarmonyOS');
  });
});
