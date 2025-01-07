import { GetCustomToken } from 'antd-style';
import { AliasToken } from 'antd/es/theme/interface';
import { camelCase } from 'lodash-es';

import { colorScales } from '@/color/colors';
import type { ColorScaleItem } from '@/color/types';
import { LobeCustomToken } from '@/types/customToken';

const generateColorPalette = ({
  name,
  scale,
  appearance,
}: {
  appearance: 'light' | 'dark';
  name: string;
  scale: ColorScaleItem;
}) => {
  return {
    [`${name}Bg`]: scale[`${appearance}A`][1],
    [`${name}BgHover`]: scale[`${appearance}A`][2],
    [`${name}Border`]: scale[appearance][4],
    [`${name}BorderSecondary`]: scale[appearance][3],
    [`${name}BorderHover`]: scale[appearance][5],
    [`${name}Hover`]: scale[appearance][10],
    [`${name}`]: scale[appearance][9],
    [`${name}Active`]: scale[appearance][7],
    [`${name}TextHover`]: scale[`${appearance}A`][10],
    [`${name}Text`]: scale[`${appearance}A`][9],
    [`${name}TextActive`]: scale[`${appearance}A`][7],
  };
};

const generateCustomColorPalette = ({
  name,
  scale,
  appearance,
}: {
  appearance: 'light' | 'dark';
  name: string;
  scale: ColorScaleItem;
}): Partial<AliasToken> => {
  const colorStepPalette: { [key: string]: string } = {};

  for (const [index, color] of scale[appearance].entries()) {
    if (index === 0 || index === 12) continue;

    colorStepPalette[`${name}${index}`] = color;
  }
  for (const [index, color] of scale[`${appearance}A`].entries()) {
    if (index === 0 || index === 12) continue;

    colorStepPalette[`${name}${index}A`] = color;
  }

  return {
    ...colorStepPalette,
    ...generateColorPalette({ appearance, name, scale }),
  };
};

export const generateCustomToken: GetCustomToken<LobeCustomToken> = ({ isDarkMode }) => {
  let colorCustomToken: any = {};

  for (const [type, scale] of Object.entries(colorScales)) {
    colorCustomToken = {
      ...colorCustomToken,
      ...generateCustomColorPalette({
        appearance: isDarkMode ? 'dark' : 'light',
        name: camelCase(type),
        scale,
      }),
    };
  }

  return colorCustomToken;
};
