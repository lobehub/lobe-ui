import { AliasToken } from 'antd/es/theme/interface';

const FONT_EMOJI = `"Segoe UI Emoji","Segoe UI Symbol","Apple Color Emoji","Twemoji Mozilla","Noto Color Emoji","Android Emoji"`;
const FONT_EN = `"HarmonyOS Sans","Segoe UI","SF Pro Display",-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif`;
const FONT_CN = `"HarmonyOS Sans SC","PingFang SC","Hiragino Sans GB","Microsoft Yahei UI","Microsoft Yahei","Source Han Sans CN",sans-serif`;
const FONT_CODE = `Hack,ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace`;

export const baseToken: Partial<AliasToken> = {
  borderRadius: 8,
  borderRadiusLG: 12,
  borderRadiusSM: 6,
  borderRadiusXS: 4,
  controlHeight: 36,
  fontFamily: [FONT_EN, FONT_CN, FONT_EMOJI].join(','),
  fontFamilyCode: [FONT_CODE, FONT_CN, FONT_EMOJI].join(','),
};
