import { GetAntdTheme } from 'antd-style';
import { darkTheme, lightTheme } from './theme';

export const getAntdTheme: GetAntdTheme = (appearance) =>
  appearance === 'dark' ? darkTheme : lightTheme;
