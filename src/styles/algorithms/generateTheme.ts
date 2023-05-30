import { ThemeConfig } from 'antd';
import { GetAntdTheme } from 'antd-style';

import darkBaseToken from '@/styles/theme/dark';
import lightBaseToken from '@/styles/theme/light';

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

export const generateTheme: GetAntdTheme = (appearance) =>
  appearance === 'dark' ? darkTheme : lightTheme;
