import { ThemeConfig } from 'antd';
import { GetAntdTheme } from 'antd-style';

import darkBaseToken from '@/styles/theme/dark';
import lightBaseToken from '@/styles/theme/light';

export const lightTheme: ThemeConfig = {
  algorithm: (seedToken, mapToken) => ({
    ...mapToken!,
    ...lightBaseToken,
  }),
  token: lightBaseToken,
};

export const darkTheme: ThemeConfig = {
  algorithm: (seedToken, mapToken) => ({
    ...mapToken!,
    ...darkBaseToken,
  }),
  token: darkBaseToken,
};

export const generateTheme: GetAntdTheme = (appearance) =>
  appearance === 'dark' ? darkTheme : lightTheme;
