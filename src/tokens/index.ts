import darkBaseToken from '@/tokens/theme/dark';
import lightBaseToken from '@/tokens/theme/light';
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

export const getLobeTheme: GetAntdTheme = (appearance) =>
  appearance === 'dark' ? darkTheme : lightTheme;
