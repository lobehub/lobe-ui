import { AliasToken } from 'antd/es/theme/interface';

import { ColorScaleItem, colorScales } from '../colors';
import { type NeutralColors, type PrimaryColors } from '../customTheme';
import { neutralColorScales } from '../neutralColors';
import { generateColorNeutralPalette, generateColorPalette } from './generateColorPalette';

interface generateCustomThemeProps {
  isDarkMode: boolean;
  neutralColor?: NeutralColors | '';
  primaryColor?: PrimaryColors | '';
}
export const generateCustomTheme = ({
  primaryColor,
  neutralColor,
  isDarkMode,
}: generateCustomThemeProps): Partial<AliasToken> => {
  const appearance = isDarkMode ? 'dark' : 'light';
  let primaryTokens = {};
  let neutralTokens = {};
  if (primaryColor) {
    const scale: ColorScaleItem = colorScales[primaryColor];
    primaryTokens = generateColorPalette({ appearance, scale, type: 'Primary' });
  }
  if (neutralColor) {
    const scale = neutralColorScales[neutralColor];
    neutralTokens = generateColorNeutralPalette({ appearance, scale });
  }
  return { ...primaryTokens, ...neutralTokens };
};
