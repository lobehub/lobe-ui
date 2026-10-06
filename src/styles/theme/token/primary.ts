import { colorScales, primary } from '@/color/colors';

import type { PrimaryColors } from '../../customTheme';
import { generateColorPalette } from '../generateColorPalette';

export const createPrimaryToken = (appearance: 'light' | 'dark', primaryColor?: PrimaryColors) => {
  const scale = (primaryColor && colorScales[primaryColor]) || primary;
  const token = generateColorPalette({ appearance, scale, type: 'Primary' });

  return {
    ...token,
    controlItemBgActive: token.colorPrimaryBg,
    controlItemBgActiveHover: token.colorPrimaryBgHover,
  };
};
