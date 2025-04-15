import { ThemeConfig } from 'antd';
import { ThemeAppearance } from 'antd-style';

import { NeutralColors, PrimaryColors } from '../customTheme';
import { darkAlgorithm } from './algorithms/darkAlgorithm';
import { lightAlgorithm } from './algorithms/lightAlgorithm';
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
  const isDark = appearance === 'dark';

  return {
    algorithm: isDark ? darkAlgorithm : lightAlgorithm,
    components: {
      Button: {
        borderRadiusSM: 6,
        contentFontSizeSM: 12,
        defaultActiveBorderColor: baseToken.colorBorder,
        defaultActiveColor: baseToken.colorText,
      },
      DatePicker: {
        activeBorderColor: baseToken.colorBorder,
        hoverBorderColor: baseToken.colorBorder,
      },
      Input: {
        activeBorderColor: baseToken.colorBorder,
        hoverBorderColor: baseToken.colorBorder,
      },
      InputNumber: {
        activeBorderColor: baseToken.colorBorder,
        hoverBorderColor: baseToken.colorBorder,
      },
      Select: {
        activeBorderColor: baseToken.colorBorder,
        hoverBorderColor: baseToken.colorBorder,
      },
      Typography: {
        titleMarginBottom: 0,
        titleMarginTop: 0,
      },
    },
    token: {
      ...baseToken,
      // @ts-ignore
      neutralColor,
      primaryColor,
    },
  };
};
