import { AliasToken } from 'antd/es/theme/interface';

import {
  generateColorNeutralPalette,
  generateColorPalette,
} from '@/styles/colors/generateColorPalette';
import { colorScales } from '@/styles/colors/colors';

const primaryToken = generateColorPalette({
  appearance: 'dark',
  scale: colorScales.bnw,
  type: 'Primary',
});

const neutralToken = generateColorNeutralPalette({
  appearance: 'dark',
  scale: colorScales.gray,
});

const successToken = generateColorPalette({
  appearance: 'dark',
  scale: colorScales.lime,
  type: 'Success',
});

const warningToken = generateColorPalette({
  appearance: 'dark',
  scale: colorScales.gold,
  type: 'Warning',
});

const errorToken = generateColorPalette({
  appearance: 'dark',
  scale: colorScales.red,
  type: 'Error',
});

const infoToken = generateColorPalette({
  appearance: 'dark',
  scale: colorScales.blue,
  type: 'Info',
});

const darkBaseToken: Partial<AliasToken> = {
  ...primaryToken,
  ...neutralToken,
  ...successToken,
  ...warningToken,
  ...errorToken,
  ...infoToken,

  boxShadow: '0 12px 20px 6px rgb(0 0 0 / 0.08)',
  boxShadowSecondary: '0 2px 8px 2px rgb(0 0 0 / 0.07), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
  colorLink: infoToken.colorInfoText,
  colorLinkActive: infoToken.colorInfoTextActive,

  colorLinkHover: infoToken.colorInfoTextHover,
  colorTextLightSolid: neutralToken.colorBgLayout,
};

export default darkBaseToken;
