import type { ThemeConfig } from 'antd';
import type { ThemeAppearance } from 'antd-style';

import type { NeutralColors, PrimaryColors } from '../customTheme';
import { createLobeToken } from './createLobeToken';
import { baseToken } from './token/base';

export interface LobeAntdThemeParams {
  appearance: ThemeAppearance;
  neutralColor?: NeutralColors;
  primaryColor?: PrimaryColors;
}

/**
 * create A LobeHub Style Antd Theme Object
 * @param neutralColor
 * @param appearance
 * @param primaryColor
 */
export const createLobeAntdTheme = ({
  neutralColor,
  appearance,
  primaryColor,
}: LobeAntdThemeParams): ThemeConfig => {
  const token = createLobeToken({
    appearance: appearance === 'dark' ? 'dark' : 'light',
    neutralColor,
    primaryColor,
  });
  // baseToken never defined colorBorder, so these component overrides have always been undefined;
  // kept as-is so antd's static CSS output stays byte-identical until antd is removed
  const { colorBorder } = baseToken as { colorBorder?: string };

  return {
    // antd drops seed keys (colorPrimary, colorError, …) from `token` overrides and its darkAlgorithm
    // rewrites them, so they must also be laid over the mapped token
    algorithm: (_seed, mapToken) => ({ ...mapToken!, ...token }),
    components: {
      Button: {
        contentFontSizeSM: 12,
      },
      DatePicker: {
        activeBorderColor: colorBorder,
        hoverBorderColor: colorBorder,
      },
      Input: {
        activeBorderColor: colorBorder,
        hoverBorderColor: colorBorder,
      },
      InputNumber: {
        activeBorderColor: colorBorder,
        hoverBorderColor: colorBorder,
      },
      Mentions: {
        activeBorderColor: colorBorder,
        hoverBorderColor: colorBorder,
      },
      Select: {
        activeBorderColor: colorBorder,
        hoverBorderColor: colorBorder,
      },
    },
    token,
  };
};
