import { App } from 'antd';
import {
  ThemeProvider as AntdThemeProvider,
  StyleProvider,
  type ThemeMode,
  extractStaticStyle,
  setupStyled,
} from 'antd-style';
import type { CustomStylishParams, CustomTokenParams } from 'antd-style/lib/types/function';
import { type ReactNode, memo, useCallback, useEffect } from 'react';
import { ThemeContext } from 'styled-components';

import FontLoader from '@/FontLoader';
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
  children: ReactNode;
  /**
   * @description Custom stylish
   */
  customStylish?: (theme: CustomStylishParams) => { [key: string]: any };
  /**
   * @description Custom extra token
   */
  customToken?: (theme: CustomTokenParams) => { [key: string]: any };
  enableWebfonts?: boolean;
  /**
   * @description Whether to inline the styles on server-side rendering or not
   */
  ssrInline?: boolean;
  /**
   * @description The mode of the theme (light or dark)
   */
  themeMode?: ThemeMode;
  /**
   * @description Webfont loader css strings
   */
  webfonts?: string[];
}

const ThemeProvider = memo<ThemeProviderProps>(
  ({
    children,
    themeMode,
    customStylish,
    customToken,
    enableWebfonts = true,
    webfonts = [
      'https://npm.elemecdn.com/@lobehub/webfont-mono/css/index.css',
      'https://npm.elemecdn.com/@lobehub/webfont-harmony-sans/css/index.css',
      'https://npm.elemecdn.com/@lobehub/webfont-harmony-sans-sc/css/index.css',
    ],
  }) => {
    useEffect(() => {
      setupStyled({ ThemeContext });
    }, []);

    const stylish = useCallback(
      (theme: CustomStylishParams) => {
        let stylish = {};
        if (customStylish) {
          stylish = customStylish(theme);
        }
        return { ...lobeCustomStylish(theme), ...stylish };
      },
      [customStylish],
    );

    const token = useCallback(
      (theme: CustomTokenParams) => {
        let token = {};

        if (customToken) {
          token = customToken(theme);
        }
        return { ...lobeCustomToken(theme), ...token };
      },
      [customToken],
    );

    return (
      <>
        {enableWebfonts &&
          webfonts?.length > 0 &&
          webfonts.map((webfont, index) => <FontLoader key={index} url={webfont} />)}
        <StyleProvider speedy={process.env.NODE_ENV === 'production'}>
          <AntdThemeProvider<LobeCustomToken>
            customStylish={stylish}
            customToken={token}
            theme={lobeTheme}
            themeMode={themeMode}
          >
            <GlobalStyle />
            <App style={{ minHeight: 'inherit', width: 'inherit' }}>{children}</App>
          </AntdThemeProvider>
        </StyleProvider>
      </>
    );
  },
);

export default ThemeProvider;
