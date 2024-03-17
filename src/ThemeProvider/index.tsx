import { App } from 'antd';
import {
  ThemeProvider as AntdThemeProvider,
  ThemeProviderProps as AntdThemeProviderProps,
  CustomStylishParams,
  CustomTokenParams,
  GetAntdTheme,
  StyleProvider,
} from 'antd-style';
import { CSSProperties, memo, useCallback } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import FontLoader from '@/FontLoader';
import { NeutralColors, PrimaryColors, lobeCustomStylish, lobeCustomToken } from '@/styles';
import { createLobeAntdTheme } from '@/styles/theme/antdTheme';
import { LobeCustomToken } from '@/types/customToken';

import GlobalStyle from './GlobalStyle';

export interface ThemeProviderProps extends Omit<AntdThemeProviderProps<any>, 'theme'> {
  className?: string;
  customStylish?: (theme: CustomStylishParams) => { [key: string]: any };
  customTheme?: {
    neutralColor?: NeutralColors;
    primaryColor?: PrimaryColors;
  };

  /**
   * @description Custom extra token
   */
  customToken?: (theme: CustomTokenParams) => { [key: string]: any };
  enableGlobalStyle?: boolean;
  enableWebfonts?: boolean;
  style?: CSSProperties;
  /**
   * @description Webfont loader css strings
   */
  webfonts?: string[];
}

const ThemeProvider = memo<ThemeProviderProps>(
  ({
    children,
    customStylish,
    customToken,
    enableWebfonts = true,
    enableGlobalStyle = true,
    webfonts,
    customTheme = {},
    className,
    style,
    ...res
  }) => {
    const genCdnUrl = useCdnFn();
    const webfontUrls = webfonts || [
      genCdnUrl({ path: 'css/index.css', pkg: '@lobehub/webfont-mono', version: 'latest' }),
      genCdnUrl({
        path: 'css/index.css',
        pkg: '@lobehub/webfont-harmony-sans',
        version: 'latest',
      }),
      genCdnUrl({
        path: 'css/index.css',
        pkg: '@lobehub/webfont-harmony-sans-sc',
        version: 'latest',
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
      (appearance) =>
        createLobeAntdTheme({
          appearance,
          neutralColor: customTheme.neutralColor,
          primaryColor: customTheme.primaryColor,
        }),
      [customTheme.primaryColor, customTheme.neutralColor],
    );

    return (
      <>
        {enableWebfonts &&
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

export default ThemeProvider;
