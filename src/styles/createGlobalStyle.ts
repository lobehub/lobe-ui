'use client';

import type { CSSInterpolation } from '@emotion/serialize';
import { useMemo } from 'react';

import { css, injectGlobal } from './css';
import { type LobeTheme, useTheme } from './theme/scope';

type GlobalStyleProps = { theme: LobeTheme };
type GlobalInterpolation = CSSInterpolation | ((props: GlobalStyleProps) => CSSInterpolation);

export const createGlobalStyle = (
  template: TemplateStringsArray | ((props: GlobalStyleProps) => CSSInterpolation),
  ...args: GlobalInterpolation[]
) => {
  const GlobalStyle = () => {
    const theme = useTheme();

    useMemo(() => {
      const props = { theme };
      const styles =
        typeof template === 'function'
          ? template(props)
          : css(template, ...args.map((arg) => (typeof arg === 'function' ? arg(props) : arg)));
      injectGlobal(styles as TemplateStringsArray);
    }, [theme]);

    return null;
  };

  return GlobalStyle;
};
