import {
  generateColorNeutralPalette,
  generateColorPalette,
} from '@/tokens/algorithms/generateColorPalette';
import { colorScales } from '@/tokens/colors';
import { AliasToken } from 'antd/es/theme/interface';

const PrimaryToken = generateColorPalette({
  type: 'Primary',
  scale: colorScales.bnw,
  themeMode: 'dark',
});

const NeutralToken = generateColorNeutralPalette({
  scale: colorScales.slate,
  themeMode: 'dark',
});

const SuccessToken = generateColorPalette({
  type: 'Success',
  scale: colorScales.lime,
  themeMode: 'dark',
});

const WarningToken = generateColorPalette({
  type: 'Warning',
  scale: colorScales.amber,
  themeMode: 'dark',
});

const ErrorToken = generateColorPalette({
  type: 'Error',
  scale: colorScales.pink,
  themeMode: 'dark',
});

const InfoToken = generateColorPalette({
  type: 'Info',
  scale: colorScales.sky,
  themeMode: 'dark',
});

const darkBaseToken: Partial<AliasToken> = {
  ...PrimaryToken,
  ...NeutralToken,
  ...SuccessToken,
  ...WarningToken,
  ...ErrorToken,
  ...InfoToken,

  colorTextLightSolid: NeutralToken.colorBgLayout,
  colorLinkHover: InfoToken.colorInfoTextHover,
  colorLink: InfoToken.colorInfoText,
  colorLinkActive: InfoToken.colorInfoTextActive,

  boxShadow: '0 12px 20px 6px rgb(0 0 0 / 0.08)',
  boxShadowSecondary: '0 2px 8px 2px rgb(0 0 0 / 0.07), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
};

export default darkBaseToken;
