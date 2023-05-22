import { ThemeConfig } from 'antd';

import { ColorPalettes, genMapTokenAlgorithm } from '../algorithms';

const lightMode = genMapTokenAlgorithm('light');

export const lightColorPalettes: ColorPalettes = lightMode.palettes;

export const lightTheme: ThemeConfig = {
  token: {
    colorTextLightSolid: '#ffffff',
    colorBgLayout: '#fafafa',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f2f2f2',
    colorBgSpotlight: '#999999',
    colorBorder: '#eaeaea',
    colorBorderSecondary: '#eaeaea',
    colorText: '#000000',
    colorTextSecondary: '#444444',
    colorTextTertiary: '#666666',
    colorTextQuaternary: '#888888',
    colorPrimary: '#000000',
    colorFill: 'rgba(0,0,0,0.1)',
    colorFillSecondary: 'rgba(0,0,0,0.075)',
    colorFillTertiary: 'rgba(0,0,0,0.05)',
    colorFillQuaternary: 'rgba(0,0,0,0)',
    borderRadius: 5,
    borderRadiusXS: 3,
    borderRadiusSM: 3,
    borderRadiusLG: 8,
    controlHeight: 36,
    boxShadow: '0 12px 20px 6px rgb(104 112 118 / 0.08)',
    boxShadowSecondary:
      '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04)',
    colorLinkHover: lightColorPalettes.primary[5],
    colorLink: lightColorPalettes.primary[6],
    colorLinkActive: lightColorPalettes.primary[7],
  },

  algorithm: (seedToken, mapToken) => ({
    ...mapToken!,
    ...lightMode.tokens,
  }),
};
