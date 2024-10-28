'use client';

import { App } from 'antd';
import {
  ThemeProvider as AntdThemeProvider,
  ThemeProviderProps as AntdThemeProviderProps,
  CustomStylishParams,
  CustomTokenParams,
  GetAntdTheme,
  StyleProvider,
} from 'antd-style';
import { merge } from 'lodash-es';
import { CSSProperties, memo, useCallback } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import FontLoader from '@/FontLoader';
import { NeutralColors, PrimaryColors, lobeCustomStylish, lobeCustomToken } from '@/styles';
import { createLobeAntdTheme } from '@/styles/theme/antdTheme';
import { LobeCustomToken } from '@/types/customToken';

import GlobalStyle from './GlobalStyle';

export interface ThemeProviderProps extends AntdThemeProviderProps<any> {
  className?: string;
  /**
   * @description Webfont loader css strings
   */
  customFonts?: string[];
  customStylish?: (theme: CustomStylishParams) => { [key: string]: any };

  customTheme?: {
    neutralColor?: NeutralColors;
    primaryColor?: PrimaryColors;
  };
  /**
   * @description Custom extra token
   */
  customToken?: (theme: CustomTokenParams) => { [key: string]: any };
  enableCustomFonts?: boolean;
  enableGlobalStyle?: boolean;
  style?: CSSProperties;
}

const ThemeProvider = memo<ThemeProviderProps>(
  ({
    children,
    customStylish,
    customToken,
    enableCustomFonts = true,
    enableGlobalStyle = true,
    customFonts,
    customTheme = {},
    className,
    style,
    theme: antdTheme,
    ...res
  }) => {
    const genCdnUrl = useCdnFn();
    const webfontUrls = customFonts || [
      genCdnUrl({ path: 'css/index.css', pkg: '@lobehub/webfont-mono', version: '1.0.0' }),
      genCdnUrl({
        path: 'css/index.css',
        pkg: '@lobehub/webfont-harmony-sans',
        version: '1.0.0',
      }),
      genCdnUrl({
        path: 'css/index.css',
        pkg: '@lobehub/webfont-harmony-sans-sc',
        version: '1.0.0',
      }),
      genCdnUrl({ path: 'dist/katex.min.css', pkg: 'katex', version: '0.16.8' }),
    ];

    const stylish = useCallback(
      (theme: CustomStylishParams) => ({ ...lobeCustomStylish(theme), ...customStylish?.(theme) }),
      [customStylish],
    );

    const token = useCallback(
      (theme: CustomTokenParams) => ({ ...lobeCustomToken(theme), ...customToken?.(theme) }),
      [customToken],
    );

    const theme = useCallback<GetAntdTheme>(
      (appearance) => {
        const lobeTheme = createLobeAntdTheme({
          appearance,
          neutralColor: customTheme.neutralColor,
          primaryColor: customTheme.primaryColor,
        });
        return merge(lobeTheme, antdTheme);
      },
      [customTheme.primaryColor, customTheme.neutralColor, antdTheme],
    );

    return (
      <>
        {enableCustomFonts &&
          webfontUrls?.length > 0 &&
          webfontUrls.map((webfont) => <FontLoader key={webfont} url={webfont} />)}
        <StyleProvider speedy={process.env.NODE_ENV === 'production'}>
          <AntdThemeProvider<LobeCustomToken>
            customStylish={stylish}
            customToken={token}
            {...res}
            theme={theme}
          >
            {enableGlobalStyle && <GlobalStyle />}
            <App className={className} style={{ minHeight: 'inherit', width: 'inherit', ...style }}>
              {children}
            </App>
          </AntdThemeProvider>
        </StyleProvider>
      </>
    );
  },
);

ThemeProvider.displayName = 'LobeThemeProvider';

export default ThemeProvider;
