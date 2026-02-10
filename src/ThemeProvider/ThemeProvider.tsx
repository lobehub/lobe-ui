'use client';

import { App } from 'antd';
import {
  type CustomStylishParams,
  type CustomTokenParams,
  type GetAntdTheme,
  ThemeProvider as AntdThemeProvider,
} from 'antd-style';
import { merge } from 'es-toolkit/compat';
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import FontLoader from '@/FontLoader';
import { lobeCustomStylish, lobeCustomToken } from '@/styles';
import { createLobeAntdTheme } from '@/styles/theme/antdTheme';
import { type LobeCustomToken } from '@/types/customToken';

import AntdConfigProvider from './ConfigProvider';
import { LOBE_THEME_APP_ID } from './constants';
import GlobalStyle from './GlobalStyle';
import { type ThemeProviderProps } from './type';

const CSS_VAR_PREFIX = 'css-var-';

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
    ...rest
  }) => {
    const genCdnUrl = useCdnFn();
    const appRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      const node = appRef.current;
      if (!node) return;

      const htmlEl = document.documentElement;
      let currentClasses: string[] = [];

      const syncCssVarClasses = () => {
        for (const cls of currentClasses) {
          htmlEl.classList.remove(cls);
        }

        const newClasses: string[] = [];
        let el: HTMLElement | null = node;
        while (el && el !== htmlEl) {
          for (const cls of el.classList) {
            if (cls.startsWith(CSS_VAR_PREFIX)) {
              newClasses.push(cls);
            }
          }
          el = el.parentElement;
        }

        for (const cls of newClasses) {
          htmlEl.classList.add(cls);
        }
        currentClasses = newClasses;
      };

      syncCssVarClasses();

      const observer = new MutationObserver(syncCssVarClasses);
      let el: HTMLElement | null = node;
      while (el && el !== htmlEl) {
        observer.observe(el, { attributeFilter: ['class'] });
        el = el.parentElement;
      }

      return () => {
        observer.disconnect();
        for (const cls of currentClasses) {
          htmlEl.classList.remove(cls);
        }
      };
    }, []);

    const webfontUrls = useMemo(
      () =>
        customFonts || [
          genCdnUrl({ path: 'css/index.css', pkg: '@lobehub/webfont-mono' }),
          genCdnUrl({
            path: 'css/index.css',
            pkg: '@lobehub/webfont-harmony-sans',
          }),
          genCdnUrl({
            path: 'css/index.css',
            pkg: '@lobehub/webfont-harmony-sans-sc',
          }),
          genCdnUrl({ path: 'dist/katex.min.css', pkg: 'katex' }),
        ],
      [customFonts, genCdnUrl],
    );

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
        <AntdThemeProvider<LobeCustomToken>
          customStylish={stylish}
          customToken={token}
          theme={theme}
          {...rest}
        >
          <AntdConfigProvider>
            {enableGlobalStyle && <GlobalStyle />}

            <App
              className={className}
              style={{ isolation: 'isolate', minHeight: 'inherit', width: 'inherit', ...style }}
            >
              <div id={LOBE_THEME_APP_ID} ref={appRef} style={{ display: 'contents' }}>
                {children}
              </div>
            </App>
          </AntdConfigProvider>
        </AntdThemeProvider>
      </>
    );
  },
);

ThemeProvider.displayName = 'LobeThemeProvider';

export default ThemeProvider;
