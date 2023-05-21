import { theme, ThemeConfig } from 'antd';
import { MappingAlgorithm } from 'antd-style';

import { ColorPalettes, genMapTokenAlgorithm, TokenRelationship } from '../algorithms';

const cyanColors = [
  'rgba(0, 225, 242, 0.12)',
  'rgba(0, 232, 245, 0.22)',
  'rgba(0, 237, 250, 0.32)',
  'rgba(0, 243, 255, 0.42)',
  'rgba(0, 247, 255, 0.53)',
  'rgba(0, 246, 254, 0.65)',
  'rgba(0, 247, 253, 0.77)',
  'rgba(0, 245, 255, 0.75)',
  'rgba(0, 244, 255, 0.73)',
  'rgba(0, 239, 253, 0.72)',
  'rgba(0, 237, 253, 0.7)',
];

const darkModeRelationship: TokenRelationship = (type) => {
  const key = type.toUpperCase()[0] + type.slice(1);
  return {
    [`color${key}Bg`]: 1,
    [`color${key}BgHover`]: 2,
    [`color${key}Border`]: 3,
    [`color${key}BorderHover`]: 4,
    [`color${key}Hover`]: 7,
    [`color${key}`]: 6,
    [`color${key}Active`]: 5,
    [`color${key}TextHover`]: 8,
    [`color${key}Text`]: 9,
    [`color${key}TextActive`]: 10,
  };
};

const darkMode = genMapTokenAlgorithm('dark', {
  lighter: {
    steps: 4, // 减少较亮颜色的数量
    targetBrightness: 0.8, // 降低最大亮度值
    saturationAdjustment: 0.6, // 减小较亮颜色的饱和度调整
    // saturationScale: 1,
  },
  darker: {
    steps: 6, // 增加较暗颜色的数量
    targetBrightness: 0.2, // 降低最小亮度值
    saturationAdjustment: 0.4, // 增加较暗颜色的饱和度调整
    hueAdjustment: 1, // 保持暗色调的色相调整因子
    saturationScale: 1,
  },
  reverse: true,
  relationship: darkModeRelationship,
});

export const darkColorPalettes: ColorPalettes = darkMode.palettes;

const darkAlgorithm: MappingAlgorithm = (seedToken, mapToken) => ({
  ...theme.darkAlgorithm(seedToken, mapToken),

  ...darkMode.tokens,

  'cyan-1': cyanColors[1],
  'cyan-2': cyanColors[2],
  'cyan-3': cyanColors[3],
  'cyan-4': cyanColors[4],
  'cyan-5': cyanColors[5],
  'cyan-6': cyanColors[6],
  'cyan-7': cyanColors[7],
  'cyan-8': cyanColors[8],
  'cyan-9': cyanColors[9],
  'cyan-10': cyanColors[10],
});

export const darkTheme: ThemeConfig = {
  token: {
    colorTextLightSolid: '#000000',
    colorBgLayout: '#000000',
    colorBgContainer: '#111111',
    colorBgElevated: '#222222',
    colorBgSpotlight: '#444444',
    colorBorder: '#333333',
    colorBorderSecondary: '#333333',
    colorText: '#ffffff',
    colorTextSecondary: '#999999',
    colorTextTertiary: '#888888',
    colorTextQuaternary: '#666666',
    colorPrimary: '#ffffff',
    colorInfo: '#0070f3',
    colorSuccess: '#50e3c2',
    colorWarning: '#f5a623',
    colorError: '#ee0000',
    colorFillQuaternary: 'rgba(0,0,0,0)',
    borderRadius: 5,
    borderRadiusXS: 3,
    borderRadiusSM: 3,
    borderRadiusLG: 8,
    controlHeight: 36,
    boxShadow: '0 12px 20px 6px rgb(0 0 0 / 0.08)',
    boxShadowSecondary: '0 2px 8px 2px rgb(0 0 0 / 0.07), 0 2px 4px -1px rgb(0 0 0 / 0.04)',

    colorLinkHover: darkColorPalettes.primary[7],
    colorLink: darkColorPalettes.primary[6],
    colorLinkActive: darkColorPalettes.primary[5],
  },
  algorithm: darkAlgorithm,
};
