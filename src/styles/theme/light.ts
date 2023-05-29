import {
  generateColorNeutralPalette,
  generateColorPalette,
} from '@/styles/algorithms/generateColorPalette';
import { colorScales } from '@/styles/colors';
import { AliasToken } from 'antd/es/theme/interface';
import { baseToken } from './base';

const primaryToken = generateColorPalette({
  type: 'Primary',
  scale: colorScales.bnw,
  appearance: 'light',
});

const neutralToken = generateColorNeutralPalette({
  scale: colorScales.gray,
  appearance: 'light',
});

const successToken = generateColorPalette({
  type: 'Success',
  scale: colorScales.green,
  appearance: 'light',
});

const warningToken = generateColorPalette({
  type: 'Warning',
  scale: colorScales.orange,
  appearance: 'light',
});

const errorToken = generateColorPalette({
  type: 'Error',
  scale: colorScales.volcano,
  appearance: 'light',
});

const infoToken = generateColorPalette({
  type: 'Info',
  scale: colorScales.geekblue,
  appearance: 'light',
});

const lightBaseToken: Partial<AliasToken> = {
  ...baseToken,
  ...primaryToken,
  ...neutralToken,
  ...successToken,
  ...warningToken,
  ...errorToken,
  ...infoToken,

  colorTextLightSolid: neutralToken.colorBgLayout,
  colorLinkHover: infoToken.colorInfoTextHover,
  colorLink: infoToken.colorInfoText,
  colorLinkActive: infoToken.colorInfoTextActive,

  boxShadow: '0 12px 20px 6px rgb(104 112 118 / 0.08)',
  boxShadowSecondary:
    '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04)',
};

export default lightBaseToken;
