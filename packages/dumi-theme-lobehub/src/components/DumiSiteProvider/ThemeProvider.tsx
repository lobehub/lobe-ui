import {
  CustomTokenParams,
  ThemeProvider as Provider,
  StyleProvider,
  extractStaticStyle,
} from 'antd-style';
import { ReactNode, useCallback } from 'react';

import { useThemeStore } from '../../store/useThemeStore';
import { createCustomToken, getAntdTheme, getCustomStylish } from '../../styles';
import { SiteConfigToken } from '../../types';

export interface ThemeProviderProps {
  token?: Partial<SiteConfigToken>;
  children?: ReactNode;
  ssrInline?: boolean;
  cache?: typeof extractStaticStyle.cache;
}

export const ThemeProvider = ({ children, token, ssrInline, cache }: ThemeProviderProps) => {
  const themeMode = useThemeStore((s) => s.themeMode);

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
    <StyleProvider
      speedy={process.env.NODE_ENV === 'production'}
      prefix={'site'}
      cache={cache}
      ssrInline={ssrInline}
    >
      <Provider
        prefixCls={'site'}
        themeMode={themeMode}
        theme={getAntdTheme}
        customStylish={getCustomStylish}
        customToken={getCustomToken}
      >
        {children}
      </Provider>
    </StyleProvider>
  );
};
