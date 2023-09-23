import { MappingAlgorithm } from 'antd/es/theme/interface';

import {
  NeutralColors,
  PrimaryColors,
  generateColorNeutralPalette,
  generateColorPalette,
  neutralColorScales,
} from '@/styles';
import { ColorScaleItem, colorScales } from '@/styles/colors/colors';
import lightBaseToken from '@/styles/theme/token/light';

export const lightAlgorithm: MappingAlgorithm = (seedToken, mapToken) => {
  const primaryColor = seedToken.colorPrimary as PrimaryColors;
  const neutralColor = seedToken.colorBgBase as NeutralColors;

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
  };
};
