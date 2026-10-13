import { colorScales, primary } from '@/color/colors';

import {
  generatePrimaryScale,
  isCustomPrimaryColor,
  type LobePrimaryColor,
} from '../customPrimary';
import { generateColorPalette } from '../generateColorPalette';

const resolveScale = (primaryColor?: LobePrimaryColor) => {
  if (isCustomPrimaryColor(primaryColor)) return generatePrimaryScale(primaryColor);
  return (primaryColor && colorScales[primaryColor]) || primary;
};

export const createPrimaryToken = (
  appearance: 'light' | 'dark',
  primaryColor?: LobePrimaryColor,
) => {
  const token = generateColorPalette({
    appearance,
    scale: resolveScale(primaryColor),
    type: 'Primary',
  });

  return {
    ...token,
    controlItemBgActive: token.colorPrimaryBg,
    controlItemBgActiveHover: token.colorPrimaryBgHover,
  };
};
