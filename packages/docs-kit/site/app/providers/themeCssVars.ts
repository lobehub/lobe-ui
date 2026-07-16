import { cssVar } from 'antd-style';

import { lobeThemeTokens } from './themeTokens';

export {
  darkReadableOnPrimary,
  lobeThemeTokens,
  themeCssVarPalettes,
  toKebabCase,
} from './themeTokens';

const POLISHED_CONSUMED_TOKENS = new Set(['colorBgMask', 'colorPrimary']);

export const cssVarTokenOverrides = (() => {
  const overrides: Record<string, string> = {};

  for (const [key, lightValue] of Object.entries(lobeThemeTokens.light)) {
    if (POLISHED_CONSUMED_TOKENS.has(key)) continue;
    if (typeof lightValue !== 'string' || lightValue === lobeThemeTokens.dark[key]) continue;
    const ref = (cssVar as unknown as Record<string, string>)[key];
    if (ref) overrides[key] = ref;
  }

  overrides.colorBgContainerSecondary = `color-mix(in srgb, ${cssVar.colorBgLayout} 50%, ${cssVar.colorBgContainer})`;

  return overrides;
})();
