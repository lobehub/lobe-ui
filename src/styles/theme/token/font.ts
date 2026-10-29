const SYSTEM_SANS = [
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI Variable Display',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
];

const LATIN = ['Geist', ...SYSTEM_SANS];

const LATIN_ZH_HANS = ['HarmonyOS Sans', ...SYSTEM_SANS];

const CODE = [
  'Geist Mono',
  'ui-monospace',
  'SFMono-Regular',
  'SF Mono',
  'Menlo',
  'Cascadia Code',
  'Consolas',
  'Liberation Mono',
];

const SC_SYSTEM = [
  'PingFang SC',
  'Hiragino Sans GB',
  'Microsoft YaHei UI',
  'Microsoft YaHei',
  'Source Han Sans SC',
  'Noto Sans CJK SC',
];

const SC = ['HarmonyOS Sans SC', ...SC_SYSTEM];

const TC = [
  'PingFang TC',
  'Hiragino Sans CNS',
  'Microsoft JhengHei UI',
  'Microsoft JhengHei',
  'Source Han Sans TC',
  'Noto Sans CJK TC',
];

const HK = ['PingFang HK', 'Source Han Sans HC', 'Noto Sans CJK HK', ...TC];

const MO = ['PingFang MO', ...HK];

const JP = [
  'Hiragino Sans',
  'Hiragino Kaku Gothic ProN',
  'Yu Gothic UI',
  'Yu Gothic',
  'Meiryo',
  'Source Han Sans JP',
  'Noto Sans CJK JP',
];

const KR = ['Apple SD Gothic Neo', 'Malgun Gothic', 'Source Han Sans KR', 'Noto Sans CJK KR'];

const ARABIC = ['SF Arabic', 'Geeza Pro', 'Noto Sans Arabic', 'Tahoma'];

const HEBREW = ['SF Hebrew', 'Arial Hebrew', 'Noto Sans Hebrew'];

const THAI = ['Thonburi', 'Leelawadee UI', 'Noto Sans Thai'];

const DEVANAGARI = ['Kohinoor Devanagari', 'Nirmala UI', 'Noto Sans Devanagari'];

const FALLBACK = ['ui-sans-serif', 'system-ui', 'sans-serif'];

const FALLBACK_CODE = ['monospace'];

const EMOJI = ['Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'];

interface LocaleFonts {
  langs: string[];
  latin?: string[];
  local?: string[];
  sc?: string[];
}

// Han glyphs differ per region and the first CJK family in the stack wins, so a locale's own
// families go ahead of the SC fallback. Traditional chinese stays on system fonts because
// HarmonyOS Sans SC draws traditional characters with mainland glyph shapes.
// Later entries are more specific: the generated :lang() rules rely on this source order.
export const LOCALE_FONTS: LocaleFonts[] = [
  { langs: ['zh'], latin: LATIN_ZH_HANS },
  { langs: ['zh-TW', 'zh-Hant'], latin: SYSTEM_SANS, local: TC, sc: SC_SYSTEM },
  { langs: ['zh-HK'], latin: SYSTEM_SANS, local: HK, sc: SC_SYSTEM },
  { langs: ['zh-MO'], latin: SYSTEM_SANS, local: MO, sc: SC_SYSTEM },
  { langs: ['ja'], local: JP },
  { langs: ['ko'], local: KR },
  { langs: ['ar', 'fa'], local: ARABIC },
  { langs: ['he'], local: HEBREW },
  { langs: ['th'], local: THAI },
  { langs: ['hi', 'mr', 'ne'], local: DEVANAGARI },
];

const matchLocaleFonts = (locale?: string): LocaleFonts | undefined => {
  if (!locale) return;
  const tag = locale.toLowerCase();
  let best: { fonts: LocaleFonts; length: number } | undefined;

  for (const fonts of LOCALE_FONTS) {
    for (const lang of fonts.langs) {
      const prefix = lang.toLowerCase();
      if (tag !== prefix && !tag.startsWith(`${prefix}-`)) continue;
      if (!best || prefix.length > best.length) best = { fonts, length: prefix.length };
    }
  }

  return best?.fonts;
};

const quote = (font: string) =>
  font.includes(',') || font.includes('"') || !font.includes(' ') ? font : `"${font}"`;

const join = (fonts: (string | undefined)[]) =>
  fonts
    .map((font) => font?.trim())
    .filter((font): font is string => !!font)
    .map(quote)
    .join(',');

export interface GenFontFamilyOptions {
  locale?: string;
  prepend?: (string | undefined)[];
}

export const genFontFamily = ({ locale, prepend = [] }: GenFontFamilyOptions = {}) => {
  const fonts = matchLocaleFonts(locale);

  return join([
    ...prepend,
    ...(fonts?.latin ?? LATIN),
    ...(fonts?.local ?? []),
    ...(fonts?.sc ?? SC),
    ...FALLBACK,
    ...EMOJI,
  ]);
};

export const genFontFamilyCode = ({ locale, prepend = [] }: GenFontFamilyOptions = {}) => {
  const fonts = matchLocaleFonts(locale);

  return join([
    ...prepend,
    ...CODE,
    ...(fonts?.local ?? []),
    ...(fonts?.sc ?? SC),
    ...FALLBACK_CODE,
    ...EMOJI,
  ]);
};
