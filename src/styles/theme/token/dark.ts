import type { AliasToken } from 'antd/es/theme/interface';

import { blue, gold, gray, lime, primary, red } from '@/color/colors';

import { generateColorNeutralPalette, generateColorPalette } from '../generateColorPalette';

const primaryToken = generateColorPalette({
  appearance: 'dark',
  scale: primary,
  type: 'Primary',
});

const neutralToken = generateColorNeutralPalette({
  appearance: 'dark',
  scale: gray,
});

const successToken = generateColorPalette({
  appearance: 'dark',
  scale: lime,
  type: 'Success',
});

const warningToken = generateColorPalette({
  appearance: 'dark',
  scale: gold,
  type: 'Warning',
});

const errorToken = generateColorPalette({
  appearance: 'dark',
  scale: red,
  type: 'Error',
});

const infoToken = generateColorPalette({
  appearance: 'dark',
  scale: blue,
  type: 'Info',
});

const darkBaseToken: Partial<AliasToken> = {
  ...primaryToken,
  ...neutralToken,
  ...successToken,
  ...warningToken,
  ...errorToken,
  ...infoToken,

  colorLink: infoToken.colorInfoText,
  colorLinkActive: infoToken.colorInfoTextActive,

  colorLinkHover: infoToken.colorInfoTextHover,
  colorTextLightSolid: neutralToken.colorBgLayout,
};

export default darkBaseToken;
