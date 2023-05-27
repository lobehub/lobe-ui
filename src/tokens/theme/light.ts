import {
  generateColorNeutralPalette,
  generateColorPalette,
} from '@/tokens/algorithms/generateColorPalette';
import { colorScales } from '@/tokens/colors';
import { AliasToken } from 'antd/es/theme/interface';

const PrimaryToken = generateColorPalette({
  type: 'Primary',
  scale: colorScales.bnw,
  themeMode: 'light',
});

const NeutralToken = generateColorNeutralPalette({
  scale: colorScales.gray,
  themeMode: 'light',
});

const SuccessToken = generateColorPalette({
  type: 'Success',
  scale: colorScales.grass,
  themeMode: 'light',
});

const WarningToken = generateColorPalette({
  type: 'Warning',
  scale: colorScales.orange,
  themeMode: 'light',
});

const ErrorToken = generateColorPalette({
  type: 'Error',
  scale: colorScales.tomato,
  themeMode: 'light',
});

const InfoToken = generateColorPalette({
  type: 'Info',
  scale: colorScales.blue,
  themeMode: 'light',
});

const lightBaseToken: Partial<AliasToken> = {
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

  boxShadow: '0 12px 20px 6px rgb(104 112 118 / 0.08)',
  boxShadowSecondary:
    '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04)',
};

export default lightBaseToken;
