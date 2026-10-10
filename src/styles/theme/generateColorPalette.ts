import { capitalize } from 'es-toolkit/compat';

import type { ColorScaleItem } from '@/color/types';

type PaletteSuffix =
  | 'Fill'
  | 'FillSecondary'
  | 'FillTertiary'
  | 'FillQuaternary'
  | 'Bg'
  | 'BgHover'
  | 'Border'
  | 'BorderHover'
  | 'Hover'
  | ''
  | 'Active'
  | 'TextHover'
  | 'Text'
  | 'TextActive';

export const generateColorPalette = <T extends string>({
  type,
  scale,
  appearance,
}: {
  appearance: 'light' | 'dark';
  scale: ColorScaleItem;
  type: T;
}): Record<`color${Capitalize<T>}${PaletteSuffix}`, string> => {
  const name = capitalize(type);
  const isDarkMode = appearance === 'dark';
  return {
    [`color${name}Fill`]: scale[`${appearance}A`][isDarkMode ? 3 : 4],
    [`color${name}FillSecondary`]: scale[`${appearance}A`][isDarkMode ? 2 : 3],
    [`color${name}FillTertiary`]: scale[`${appearance}A`][isDarkMode ? 1 : 2],
    [`color${name}FillQuaternary`]: scale[`${appearance}A`][isDarkMode ? 0 : 1],
    [`color${name}Bg`]: scale[appearance][1],
    [`color${name}BgHover`]: scale[appearance][2],
    [`color${name}Border`]: scale[appearance][4],
    [`color${name}BorderHover`]: scale[appearance][isDarkMode ? 5 : 3],
    [`color${name}Hover`]: scale[appearance][isDarkMode ? 10 : 8],
    [`color${name}`]: scale[appearance][9],
    [`color${name}Active`]: scale[appearance][isDarkMode ? 7 : 10],
    [`color${name}TextHover`]: scale[appearance][isDarkMode ? 10 : 8],
    [`color${name}Text`]: scale[appearance][9],
    [`color${name}TextActive`]: scale[appearance][isDarkMode ? 7 : 10],
  } as Record<`color${Capitalize<T>}${PaletteSuffix}`, string>;
};

export const generateColorNeutralPalette = ({
  scale,
  appearance,
}: {
  appearance: 'light' | 'dark';
  scale: ColorScaleItem;
}) => {
  return {
    colorBgContainer: appearance === 'dark' ? scale[appearance][1] : scale[appearance][0],
    colorBgElevated: appearance === 'dark' ? scale[appearance][2] : scale[appearance][0],
    colorBgLayout: appearance === 'dark' ? scale[appearance][0] : scale[appearance][1],
    colorBgMask: scale.lightA[8],
    colorBgSpotlight: scale[appearance][4],
    colorBorder: scale[appearance][3],
    colorBorderSecondary: scale[appearance][2],
    colorFill: scale[`${appearance}A`][3],
    colorFillQuaternary: scale[`${appearance}A`][0],
    colorFillSecondary: scale[`${appearance}A`][2],
    colorFillTertiary: scale[`${appearance}A`][1],
    colorText: scale[appearance][12],
    colorTextQuaternary: scale[appearance][6],
    colorTextSecondary: scale[appearance][10],
    colorTextTertiary: scale[appearance][8],
  };
};
