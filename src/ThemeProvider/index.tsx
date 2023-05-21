import { ThemeProvider as AntdThemeProvider, setupStyled, type ThemeAppearance } from 'antd-style';
import { AliasToken } from 'antd/es/theme/interface';
import React from 'react';
import { ThemeContext } from 'styled-components';
import GlobalStyle from './GlobalStyle';
import { darkToken as dark, lightToken as light } from './token';

export interface ThemeProviderProps {
  children: React.ReactNode;
  appearance?: ThemeAppearance;
  lightToken?: Partial<AliasToken>;
  darkToken?: Partial<AliasToken>;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  appearance,
  lightToken = {},
  darkToken = {},
}) => {
  setupStyled({ ThemeContext });
  return (
    <AntdThemeProvider
      appearance={appearance}
      theme={(appearance: ThemeAppearance) => {
        switch (appearance) {
          case 'light':
            return {
              token: { ...light, ...lightToken },
            };
          case 'dark':
          default:
            return {
              token: { ...dark, ...darkToken },
            };
        }
      }}
    >
      <GlobalStyle />
      {children}
    </AntdThemeProvider>
  );
};

export default ThemeProvider;
