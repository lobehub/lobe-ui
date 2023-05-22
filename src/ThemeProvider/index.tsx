import { App } from 'antd';
import {
  ThemeProvider as AntdThemeProvider,
  StyleProvider,
  extractStaticStyle,
  setupStyled,
  type CustomTokenParams,
  type ThemeMode,
} from 'antd-style';
import React, { useCallback } from 'react';
import { ThemeContext } from 'styled-components';
import { createCustomToken, getAntdTheme, getCustomStylish } from '../styles';
import GlobalStyle from './GlobalStyle';

export interface ThemeProviderProps {
  token?: any;
  children: React.ReactNode;
  themeMode?: ThemeMode;
  ssrInline?: boolean;
  cache?: typeof extractStaticStyle.cache;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ token, children, themeMode }) => {
  setupStyled({ ThemeContext });
  const getCustomToken = useCallback(
    (params: CustomTokenParams) => {
      const base = createCustomToken(params);

      if (token) {
        return { ...base, ...token };
      } else {
        return base;
      }
    },
    [token],
  );

  return (
    <StyleProvider speedy={process.env.NODE_ENV === 'production'}>
      <AntdThemeProvider
        themeMode={themeMode}
        theme={getAntdTheme}
        customStylish={getCustomStylish}
        customToken={getCustomToken}
      >
        <GlobalStyle />
        <App style={{ minHeight: 'inherit', width: 'inherit' }}>{children}</App>
      </AntdThemeProvider>
    </StyleProvider>
  );
};

export default ThemeProvider;
