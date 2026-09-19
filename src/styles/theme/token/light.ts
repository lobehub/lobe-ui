import type { AliasToken } from 'antd/es/theme/interface';

import { geekblue, gold, gray, green, primary, volcano } from '@/color/colors';

import { generateColorNeutralPalette, generateColorPalette } from '../generateColorPalette';

const primaryToken = generateColorPalette({
  appearance: 'light',
  scale: primary,
  type: 'Primary',
});

const neutralToken = generateColorNeutralPalette({
  appearance: 'light',
  scale: gray,
});

const successToken = generateColorPalette({
  appearance: 'light',
  scale: green,
  type: 'Success',
});

const warningToken = generateColorPalette({
  appearance: 'light',
  scale: gold,
  type: 'Warning',
});

const errorToken = generateColorPalette({
  appearance: 'light',
  scale: volcano,
  type: 'Error',
});

const infoToken = generateColorPalette({
  appearance: 'light',
  scale: geekblue,
  type: 'Info',
});

const lightBaseToken: Partial<AliasToken> = {
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

export default lightBaseToken;
