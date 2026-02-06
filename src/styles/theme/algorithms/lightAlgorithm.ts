import type { MappingAlgorithm } from 'antd/es/theme/interface';

import { colorScales } from '@/color/colors';
import { neutralColorScales } from '@/color/neutrals';
import type { ColorScaleItem } from '@/color/types';

import type { NeutralColors, PrimaryColors } from '../../customTheme';
import { generateCustomColorToken } from '../customToken';
import { generateColorNeutralPalette, generateColorPalette } from '../generateColorPalette';
import lightBaseToken from '../token/light';

export const lightAlgorithm: MappingAlgorithm = (seedToken, mapToken) => {
  const primaryColor = (seedToken as any).primaryColor as PrimaryColors;
  const neutralColor = (seedToken as any).neutralColor as NeutralColors;

  let primaryTokens = {};
  let neutralTokens = {};
  const primaryScale: ColorScaleItem = colorScales[primaryColor];

  if (primaryScale) {
    primaryTokens = generateColorPalette({
      appearance: 'light',
      scale: primaryScale,
      type: 'Primary',
    });
  }

  const neutralScale = neutralColorScales[neutralColor];
  if (neutralScale) {
    neutralTokens = generateColorNeutralPalette({ appearance: 'light', scale: neutralScale });
  }

  return {
    ...mapToken!,
    ...lightBaseToken,
    ...primaryTokens,
    ...neutralTokens,
    ...generateCustomColorToken(false),
  };
};
