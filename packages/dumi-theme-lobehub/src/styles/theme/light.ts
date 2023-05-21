import { ThemeConfig } from 'antd';

import { ColorPalettes, genMapTokenAlgorithm } from '../algorithms';

const lightMode = genMapTokenAlgorithm();

export const lightColorPalettes: ColorPalettes = lightMode.palettes;

export const lightTheme: ThemeConfig = {
  token: {
    colorBgLayout: '#f8f8fa', // Layout 颜色
    colorTextBase: '#2a2e36',

    colorLinkHover: lightColorPalettes.primary[5],
    colorLink: lightColorPalettes.primary[6],
    colorLinkActive: lightColorPalettes.primary[7],
  },

  algorithm: (seedToken, mapToken) => ({
    ...mapToken!,
    ...lightMode.tokens,
  }),
};
