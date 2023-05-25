import { ThemeConfig } from 'antd';

const fontEmoji = `""Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"`;
const fontEn = `"Segoe UI", "SF Pro Display",-apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`;
const fontCn = `"PingFang SC", "Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei", "Source Han Sans CN", sans-serif`;
const fontCode = `"Hack Nerd Font Mono", Hack, "SFMono Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace`;
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
    fontFamily: [fontEn, fontCn, fontEmoji].join(','),
    fontFamilyCode: fontCode,
  },
};
