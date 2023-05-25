import { ThemeConfig } from 'antd';

const FONT_EMOJI = `"Segoe UI Emoji", "Segoe UI Symbol", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"`;
const FONT_EN = `"HarmonyOS Sans", "Segoe UI", "SF Pro Display",-apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`;
const FONT_CN = `"HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei", "Source Han Sans CN", sans-serif`;
const FONT_CODE = `Hack, "SFMono Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace`;
export const baseTheme: ThemeConfig = {
  token: {
    colorInfo: '#0070f3',
    colorSuccess: '#50e3c2',
    colorWarning: '#f5a623',
    colorError: '#ee0000',
    borderRadius: 5,
    borderRadiusXS: 3,
    borderRadiusSM: 3,
    borderRadiusLG: 8,
    controlHeight: 36,
    fontFamily: [FONT_EN, FONT_CN, FONT_EMOJI].join(','),
    fontFamilyCode: [FONT_CODE, FONT_CN, FONT_EMOJI].join(','),
  },
};
