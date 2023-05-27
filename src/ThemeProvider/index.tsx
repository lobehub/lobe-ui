import { LobeCustomToken } from '@/types/customToken';
import { App } from 'antd';
import {
  ThemeProvider as AntdThemeProvider,
  StyleProvider,
  extractStaticStyle,
  setupStyled,
  type ThemeMode,
} from 'antd-style';
import { memo } from 'react';
import { lobeCustomStylish, lobeCustomToken, lobeTheme } from 'src/styles';
// @ts-ignore
import ReactFontLoader from 'react-font-loader';
import { ThemeContext } from 'styled-components';
import GlobalStyle from './GlobalStyle';

export interface ThemeProviderProps {
  /**
   * @description The children of the ThemeProvider component
   */
  children: React.ReactNode;
  /**
   * @description The mode of the theme (light or dark)
   */
  themeMode?: ThemeMode;
  /**
   * @description Whether to inline the styles on server-side rendering or not
   */
  ssrInline?: boolean;
  /**
   * @description Cache for the extracted static styles
   */
  cache?: typeof extractStaticStyle.cache;
}

const ThemeProvider = memo<ThemeProviderProps>(({ children, themeMode }) => {
  setupStyled({ ThemeContext });

  return (
    <StyleProvider speedy={process.env.NODE_ENV === 'production'}>
      <AntdThemeProvider<LobeCustomToken>
        themeMode={themeMode}
        theme={lobeTheme}
        customStylish={lobeCustomStylish}
        customToken={lobeCustomToken}
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
