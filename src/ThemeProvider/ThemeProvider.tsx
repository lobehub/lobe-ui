'use client';

import { App } from 'antd';
import {
  type CustomStylishParams,
  type CustomTokenParams,
  type GetAntdTheme,
  ThemeProvider as AntdThemeProvider,
} from 'antd-style';
import { merge } from 'es-toolkit/compat';
import { memo, useCallback, useMemo, useState } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import FontLoader from '@/FontLoader';
import { lobeCustomStylish, lobeCustomToken } from '@/styles';
import { createLobeAntdTheme } from '@/styles/theme/antdTheme';
import { type LobeCustomToken } from '@/types/customToken';

import AppElementContext from './AppElementContext';
import AntdConfigProvider from './ConfigProvider';
import { LOBE_THEME_APP_ID } from './constants';
import GlobalStyle from './GlobalStyle';
import { type ThemeProviderProps } from './type';

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
    const [appRef, setAppRef] = useState<HTMLDivElement | null>(null);

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
              <div id={LOBE_THEME_APP_ID} style={contentsStyle}>
                <AppElementContext value={appRef}>
                  {children}
                  {/*
                    In-tree portal host for Base UI floating components
                    (Select, Combobox, etc.). Keeping it inside `<App>` keeps
                    the antd-style / emotion theme cascade intact so popups
                    render with the correct tokens, while the layout-bearing
                    block lets Base UI's Portal actually mount — the outer
                    wrapper uses `display: contents` and cannot host portals.
                  */}
                  <div data-lobe-portal-host="" ref={setAppRef} style={hostPortalHostStyle} />
                </AppElementContext>
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

const hostPortalHostStyle: React.CSSProperties = {
  // `height: 0` keeps the host invisible and gives it no hit region of
  // its own; absolute children (Base UI Positioner) have their own hit
  // region, so we must NOT set `pointer-events: none` here — it would
  // be inherited by popup descendants and break clicks/hover.
  height: 0,
  left: 0,
  // `position: fixed` keeps a stacking context so portaled popups can
  // win over sibling z-indexes. `right: 0` (instead of `width: 0`)
  // gives the host a full viewport-width containing block — without it,
  // Base UI Positioner uses `position: absolute` against a 0-width
  // containing block and collapses text to one character per line.
  position: 'fixed',
  right: 0,
  top: 0,
  zIndex: 1100,
};

const contentsStyle: React.CSSProperties = {
  display: 'contents',
};
