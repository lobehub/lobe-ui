import { ColorScaleItem } from '@/tokens/colors';
import { AliasToken } from 'antd/es/theme/interface';

export const generateColorPalette = ({
  type,
  scale,
  themeMode,
}: {
  type: 'Primary' | 'Success' | 'Warning' | 'Error' | 'Info';
  scale: ColorScaleItem;
  themeMode: 'light' | 'dark';
}): Partial<AliasToken> => {
  return {
    [`color${type}Bg`]: scale[themeMode][1],
    [`color${type}BgHover`]: scale[themeMode][2],
    [`color${type}Border`]: scale[themeMode][4],
    [`color${type}BorderHover`]: scale[themeMode][5],
    [`color${type}Hover`]: scale[themeMode][10],
    [`color${type}`]: scale[themeMode][9],
    [`color${type}Active`]: scale[themeMode][7],
    [`color${type}TextHover`]: scale[themeMode][10],
    [`color${type}Text`]: scale[themeMode][9],
    [`color${type}Active`]: scale[themeMode][7],
  };
};

export const generateColorNeutralPalette = ({
  scale,
  themeMode,
}: {
  scale: ColorScaleItem;
  themeMode: 'light' | 'dark';
}): Partial<AliasToken> => {
  return {
    colorText: scale[themeMode][12],
    colorTextSecondary: scale[themeMode][10],
    colorTextTertiary: scale[themeMode][8],
    colorTextQuaternary: scale[themeMode][6],
    colorBorder: scale[`${themeMode}A`][4],
    colorBorderSecondary: scale[`${themeMode}A`][3],
    colorFill: scale[`${themeMode}A`][3],
    colorFillSecondary: scale[`${themeMode}A`][2],
    colorFillTertiary: scale[`${themeMode}A`][1],
    colorFillQuaternary: scale[`${themeMode}A`][0],
    colorBgContainer: themeMode === 'dark' ? scale[themeMode][1] : scale[themeMode][0],
    colorBgElevated: themeMode === 'dark' ? scale[themeMode][2] : scale[themeMode][0],
    colorBgLayout: themeMode === 'dark' ? scale[themeMode][0] : scale[themeMode][1],
    colorBgSpotlight: scale[themeMode][5],
    colorBgMask: scale.lightA[8],
  };
};
