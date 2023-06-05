import { App } from 'antd';
import {
  extractStaticStyle,
  setupStyled,
  StyleProvider,
  type ThemeMode,
  ThemeProvider as AntdThemeProvider,
} from 'antd-style';
import type { CustomStylishParams, CustomTokenParams } from 'antd-style/lib/types/function';
import { memo } from 'react';
// @ts-ignore
import ReactFontLoader from 'react-font-loader';
import { ThemeContext } from 'styled-components';

import { lobeCustomStylish, lobeCustomToken, lobeTheme } from '@/styles';
import { LobeCustomToken } from '@/types/customToken';

import GlobalStyle from './GlobalStyle';

export interface ThemeProviderProps {
  /**
   * @description Cache for the extracted static styles
   */
  cache?: typeof extractStaticStyle.cache;
  /**
   * @description The children of the ThemeProvider component
   */
  children: React.ReactNode;
  /**
   * @description Custom stylish
   */
  customStylish?: (theme: CustomStylishParams) => { [key: string]: any };
  /**
   * @description Custom extra token
   */
  customToken?: (theme: CustomTokenParams) => { [key: string]: any };
  /**
   * @description Whether to inline the styles on server-side rendering or not
   */
  ssrInline?: boolean;
  /**
   * @description The mode of the theme (light or dark)
   */
  themeMode?: ThemeMode;
}

const ThemeProvider = memo<ThemeProviderProps>(
  ({ children, themeMode, customStylish = () => ({}), customToken = () => ({}) }) => {
    setupStyled({ ThemeContext });

    return (
      <StyleProvider speedy={process.env.NODE_ENV === 'production'}>
        <AntdThemeProvider<LobeCustomToken>
          customStylish={(theme) => ({ ...lobeCustomStylish(theme), ...customStylish(theme) })}
          customToken={(theme) => ({ ...lobeCustomToken(theme), ...customToken(theme) })}
          theme={lobeTheme}
          themeMode={themeMode}
        >
          <ReactFontLoader url="https://raw.githubusercontent.com/IKKI2000/harmonyos-fonts/main/css/harmonyos_sans.css" />
          <ReactFontLoader url="https://raw.githubusercontent.com/IKKI2000/harmonyos-fonts/main/css/harmonyos_sans_sc.css" />
          <GlobalStyle />
          <App style={{ minHeight: 'inherit', width: 'inherit' }}>{children}</App>
        </AntdThemeProvider>
      </StyleProvider>
    );
  },
);

export default ThemeProvider;
