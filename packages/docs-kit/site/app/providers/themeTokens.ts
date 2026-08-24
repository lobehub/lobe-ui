import { createLobeAntdTheme } from '@lobehub/ui/es/styles/theme/antdTheme';
import { theme as antdTheme } from 'antd';

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

const lightToken = buildLobeToken('light');
const darkToken = buildLobeToken('dark');

export const lobeThemeTokens = { dark: darkToken, light: lightToken };

export const darkReadableOnPrimary = 'contrast-color(var(--ant-color-primary))';

export const themeCssVarPalettes = {
  dark: toDeclarations(darkToken),
  light: toDeclarations(lightToken),
};
