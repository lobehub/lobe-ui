import darkBaseToken from '@/styles/theme/dark';
import lightBaseToken from '@/styles/theme/light';
import { ThemeConfig } from 'antd';
import { GetAntdTheme } from 'antd-style';

export const lightTheme: ThemeConfig = {
  token: lightBaseToken,
  algorithm: (seedToken, mapToken) => ({
    ...mapToken!,
    ...lightBaseToken,
  }),
};

export const darkTheme: ThemeConfig = {
  token: darkBaseToken,
  algorithm: (seedToken, mapToken) => ({
    ...mapToken!,
    ...darkBaseToken,
  }),
};

export const lobeTheme: GetAntdTheme = (appearance) =>
  appearance === 'dark' ? darkTheme : lightTheme;
export { generateCustomStylish as lobeCustomStylish } from './algorithms/generateCustomStylish';
export { generateCustomToken as lobeCustomToken } from './algorithms/generateCustomToken';
