import { MappingAlgorithm } from 'antd/es/theme/interface';

import {
  NeutralColors,
  PrimaryColors,
  generateColorNeutralPalette,
  generateColorPalette,
  neutralColorScales,
} from '@/styles';
import { ColorScaleItem, colorScales } from '@/styles/colors/colors';
import darkBaseToken from '@/styles/theme/token/dark';

export const darkAlgorithm: MappingAlgorithm = (seedToken, mapToken) => {
  const primaryColor = seedToken.colorPrimary as PrimaryColors;
  const neutralColor = seedToken.colorBgBase as NeutralColors;

  let primaryTokens = {};
  let neutralTokens = {};

  // generate primary color Token with colorPrimary
  const primaryScale: ColorScaleItem = colorScales[primaryColor];

  if (primaryScale) {
    primaryTokens = generateColorPalette({
      appearance: 'dark',
      scale: primaryScale,
      type: 'Primary',
    });
  }

  // generate neutral color Token with colorBgBase
  const neutralScale = neutralColorScales[neutralColor];
  if (neutralScale) {
    neutralTokens = generateColorNeutralPalette({ appearance: 'dark', scale: neutralScale });
  }

  return {
    ...mapToken!,
    ...darkBaseToken,
    ...primaryTokens,
    ...neutralTokens,
  };
};
