import { App } from 'antd';
import {
  ThemeProvider as AntdThemeProvider,
  StyleProvider,
  extractStaticStyle,
  setupStyled,
  type ThemeMode,
} from 'antd-style';
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
   * @description Whether to inline the styles on server-side rendering or not
   */
  ssrInline?: boolean;
  /**
   * @description The mode of the theme (light or dark)
   */
  themeMode?: ThemeMode;
}

const ThemeProvider = memo<ThemeProviderProps>(({ children, themeMode }) => {
  setupStyled({ ThemeContext });

  return (
    <StyleProvider speedy={process.env.NODE_ENV === 'production'}>
      <AntdThemeProvider<LobeCustomToken>
        customStylish={lobeCustomStylish}
        customToken={lobeCustomToken}
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
});

export default ThemeProvider;
