import { AliasToken } from 'antd/es/theme/interface';
import { capitalize } from 'lodash-es';

import { ColorScaleItem } from '@/styles/colors';

export const generateColorPalette = ({
  type,
  scale,
  appearance,
}: {
  appearance: 'light' | 'dark';
  scale: ColorScaleItem;
  type: 'Primary' | 'Success' | 'Warning' | 'Error' | 'Info' | string;
}): Partial<AliasToken> => {
  const name = capitalize(type);

  return {
    [`color${name}Bg`]: scale[appearance][1],
    [`color${name}BgHover`]: scale[appearance][2],
    [`color${name}Border`]: scale[appearance][4],
    [`color${name}BorderHover`]: scale[appearance][5],
    [`color${name}Hover`]: scale[appearance][10],
    [`color${name}`]: scale[appearance][9],
    [`color${name}Active`]: scale[appearance][7],
    [`color${name}TextHover`]: scale[appearance][10],
    [`color${name}Text`]: scale[appearance][9],
    [`color${name}TextActive`]: scale[appearance][7],
  };
};

export const generateColorNeutralPalette = ({
  scale,
  appearance,
}: {
  appearance: 'light' | 'dark';
  scale: ColorScaleItem;
}): Partial<AliasToken> => {
  return {
    colorText: scale[appearance][12],
    colorTextSecondary: scale[appearance][10],
    colorTextTertiary: scale[appearance][8],
    colorTextQuaternary: scale[appearance][6],
    colorBorder: scale[appearance][4],
    colorBorderSecondary: scale[appearance][3],
    colorFill: scale[`${appearance}A`][3],
    colorFillSecondary: scale[`${appearance}A`][2],
    colorFillTertiary: scale[`${appearance}A`][1],
    colorFillQuaternary: scale[`${appearance}A`][0],
    colorBgContainer: appearance === 'dark' ? scale[appearance][1] : scale[appearance][0],
    colorBgElevated: appearance === 'dark' ? scale[appearance][2] : scale[appearance][0],
    colorBgLayout: appearance === 'dark' ? scale[appearance][0] : scale[appearance][1],
    colorBgSpotlight: scale[appearance][5],
    colorBgMask: scale.lightA[8],
  };
};
