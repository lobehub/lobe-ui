import {
  generateColorNeutralPalette,
  generateColorPalette,
} from '@/tokens/algorithms/generateColorPalette';
import { colorScales } from '@/tokens/colors';
import { AliasToken } from 'antd/es/theme/interface';
import { baseToken } from './base';

const primaryToken = generateColorPalette({
  type: 'Primary',
  scale: colorScales.bnw,
  themeMode: 'dark',
});

const neutralToken = generateColorNeutralPalette({
  scale: colorScales.gray,
  themeMode: 'dark',
});

const successToken = generateColorPalette({
  type: 'Success',
  scale: colorScales.lime,
  themeMode: 'dark',
});

const warningToken = generateColorPalette({
  type: 'Warning',
  scale: colorScales.amber,
  themeMode: 'dark',
});

const errorToken = generateColorPalette({
  type: 'Error',
  scale: colorScales.pink,
  themeMode: 'dark',
});

const infoToken = generateColorPalette({
  type: 'Info',
  scale: colorScales.sky,
  themeMode: 'dark',
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
