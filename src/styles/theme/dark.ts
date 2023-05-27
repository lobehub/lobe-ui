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
  appearance: 'dark',
});

const neutralToken = generateColorNeutralPalette({
  scale: colorScales.gray,
  appearance: 'dark',
});

const successToken = generateColorPalette({
  type: 'Success',
  scale: colorScales.lime,
  appearance: 'dark',
});

const warningToken = generateColorPalette({
  type: 'Warning',
  scale: colorScales.amber,
  appearance: 'dark',
});

const errorToken = generateColorPalette({
  type: 'Error',
  scale: colorScales.pink,
  appearance: 'dark',
});

const infoToken = generateColorPalette({
  type: 'Info',
  scale: colorScales.sky,
  appearance: 'dark',
});

const darkBaseToken: Partial<AliasToken> = {
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

  boxShadow: '0 12px 20px 6px rgb(0 0 0 / 0.08)',
  boxShadowSecondary: '0 2px 8px 2px rgb(0 0 0 / 0.07), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
};

export default darkBaseToken;
