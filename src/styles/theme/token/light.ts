import { AliasToken } from 'antd/es/theme/interface';

import {
  generateColorNeutralPalette,
  generateColorPalette,
} from '@/styles/colors/generateColorPalette';
import { colorScales } from '@/styles/colors/colors';

const primaryToken = generateColorPalette({
  appearance: 'light',
  scale: colorScales.bnw,
  type: 'Primary',
});

const neutralToken = generateColorNeutralPalette({
  appearance: 'light',
  scale: colorScales.gray,
});

const successToken = generateColorPalette({
  appearance: 'light',
  scale: colorScales.green,
  type: 'Success',
});

const warningToken = generateColorPalette({
  appearance: 'light',
  scale: colorScales.orange,
  type: 'Warning',
});

const errorToken = generateColorPalette({
  appearance: 'light',
  scale: colorScales.volcano,
  type: 'Error',
});

const infoToken = generateColorPalette({
  appearance: 'light',
  scale: colorScales.geekblue,
  type: 'Info',
});

const lightBaseToken: Partial<AliasToken> = {
  ...primaryToken,
  ...neutralToken,
  ...successToken,
  ...warningToken,
  ...errorToken,
  ...infoToken,

  boxShadow: '0 12px 20px 6px rgb(104 112 118 / 0.08)',
  boxShadowSecondary:
    '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04)',
  colorLink: infoToken.colorInfoText,
  colorLinkActive: infoToken.colorInfoTextActive,

  colorLinkHover: infoToken.colorInfoTextHover,
  colorTextLightSolid: neutralToken.colorBgLayout,
};

export default lightBaseToken;
