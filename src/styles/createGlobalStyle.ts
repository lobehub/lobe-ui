'use client';

import type { CSSInterpolation } from '@emotion/serialize';
import { useInsertionEffect, useMemo, useRef } from 'react';

import { createGlobalSheet, css, injectGlobal } from './css';
import { type LobeTheme, useTheme } from './theme/scope';

type GlobalStyleProps = { theme: LobeTheme };
type GlobalInterpolation = CSSInterpolation | ((props: GlobalStyleProps) => CSSInterpolation);

const isServer = typeof document === 'undefined';

export const createGlobalStyle = (
  template: TemplateStringsArray | ((props: GlobalStyleProps) => CSSInterpolation),
  ...args: GlobalInterpolation[]
) => {
  const GlobalStyle = () => {
    const theme = useTheme();
    const sheetRef = useRef<ReturnType<typeof createGlobalSheet>>(null);

    const styles = useMemo(() => {
      const props = { theme };
      const resolved =
        typeof template === 'function'
          ? template(props)
          : css(template, ...args.map((arg) => (typeof arg === 'function' ? arg(props) : arg)));
      // Server renders keep feeding the shared cache so extractStaticStyle ships them.
      if (isServer) injectGlobal(resolved as TemplateStringsArray);
      return resolved;
    }, [theme]);

    useInsertionEffect(() => {
      const sheet = createGlobalSheet();
      sheetRef.current = sheet;
      return () => {
        sheet.remove();
        sheetRef.current = null;
      };
    }, []);

    useInsertionEffect(() => {
      sheetRef.current?.update(styles);
    }, [styles]);

    return null;
  };

  return GlobalStyle;
};
