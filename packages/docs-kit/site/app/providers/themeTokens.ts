import { theme as antdTheme } from 'antd';

import { createLobeAntdTheme } from '@/styles/theme/antdTheme';

type ThemeAppearance = 'dark' | 'light';

const unitless: Record<string, boolean> = {
  fontWeightStrong: true,
  lineHeight: true,
  lineHeightHeading1: true,
  lineHeightHeading2: true,
  lineHeightHeading3: true,
  lineHeightHeading4: true,
  lineHeightHeading5: true,
  lineHeightLG: true,
  lineHeightSM: true,
  opacityImage: true,
  opacityLoading: true,
  zIndexBase: true,
  zIndexPopupBase: true,
};

const ignore: Record<string, boolean> = {
  motionBase: true,
  motionUnit: true,
};

const buildLobeToken = (appearance: ThemeAppearance) => {
  const themeConfig = createLobeAntdTheme({ appearance });
  return antdTheme.getDesignToken({
    ...themeConfig,
    algorithm: [
      appearance === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      themeConfig.algorithm,
    ]
      .flat()
      .filter((algorithm): algorithm is NonNullable<typeof algorithm> => algorithm !== undefined),
  }) as unknown as Record<string, string | number>;
};

export const toKebabCase = (str: string) =>
  str
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/([a-z])(\d)/g, '$1-$2')
    .replaceAll(/(\d)([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const toDeclarations = (token: Record<string, string | number>) =>
  Object.entries(token)
    .filter(
      ([key, value]) =>
        !key.startsWith('_') &&
        !key.startsWith('screen') &&
        !key.includes('-') &&
        !(key in ignore) &&
        (typeof value === 'string' || typeof value === 'number'),
    )
    .map(([key, value]) => {
      const cssValue =
        typeof value === 'number' && !(key in unitless) ? `${value}px` : String(value);
      return `--ant-${toKebabCase(key)}: ${cssValue};`;
    })
    .join('\n');

const isBrightColor = (value: string) => {
  const hex = /^#([\da-f]{6})/i.exec(value)?.[1];
  const rgb = /^rgba?\((\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(value);
  const [r, g, b] = hex
    ? [
        Number.parseInt(hex.slice(0, 2), 16),
        Number.parseInt(hex.slice(2, 4), 16),
        Number.parseInt(hex.slice(4, 6), 16),
      ]
    : rgb
      ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
      : [0, 0, 0];
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
};

const lightToken = buildLobeToken('light');
const darkToken = buildLobeToken('dark');

export const lobeThemeTokens = { dark: darkToken, light: lightToken };

export const darkReadableOnPrimary = isBrightColor(String(darkToken.colorPrimary))
  ? '#000'
  : '#fff';

export const themeCssVarPalettes = {
  dark: toDeclarations(darkToken),
  light: toDeclarations(lightToken),
};
