import { ThemeConfig } from 'antd';

import { ColorPalettes, genMapTokenAlgorithm } from '../algorithms';
import { baseTheme } from './base';

const lightMode = genMapTokenAlgorithm('light');

export const lightColorPalettes: ColorPalettes = lightMode.palettes;

export const lightTheme: ThemeConfig = {
  token: {
    ...baseTheme.token,
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
    boxShadow: '0 12px 20px 6px rgb(104 112 118 / 0.08)',
    boxShadowSecondary:
      '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04)',

    colorLinkHover: '#3291ff',
    colorLink: '#0070f3',
    colorLinkActive: '#0761d1',
  },

  algorithm: (seedToken, mapToken) => ({
    ...mapToken!,
    ...lightMode.tokens,
  }),
};
