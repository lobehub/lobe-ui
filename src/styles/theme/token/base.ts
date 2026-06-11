import type { AliasToken } from 'antd/es/theme/interface';

const joinFontFamily = (fonts: string[]) =>
  fonts.map((font) => (font.includes(' ') ? `"${font}"` : font)).join(',');

const FONT_EMOJI = [
  '/* EMOJI */',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji',
];

const FONT_EN = [
  'Geist',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI Variable Display',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
];

const FONT_CN = [
  '/* SC */',
  'HarmonyOS Sans SC',
  'PingFang SC',
  'Hiragino Sans GB',
  'Microsoft YaHei UI',
  'Microsoft YaHei',
  'Source Han Sans SC',
  'Noto Sans CJK SC',
];

const FONT_CODE = [
  'Geist Mono',
  'ui-monospace',
  'SFMono-Regular',
  'SF Mono',
  'Menlo',
  'Cascadia Code',
  'Consolas',
  'Liberation Mono',
];

const FALLBACK = ['/* FALLBACK */', 'ui-sans-serif', 'system-ui', 'sans-serif'];

const FALLBACK_CODE = ['/* FALLBACK */', 'monospace'];

export const baseToken: Partial<AliasToken> = {
  borderRadius: 8,
  borderRadiusLG: 12,
  borderRadiusSM: 6,
  borderRadiusXS: 4,
  controlHeight: 36,
  fontFamily: joinFontFamily([FONT_EN, FONT_CN, FALLBACK, FONT_EMOJI].flat()),
  fontFamilyCode: joinFontFamily([FONT_CODE, FONT_CN, FALLBACK_CODE, FONT_EMOJI].flat()),
};
