import { GetCustomToken } from 'antd-style';
import { AliasToken } from 'antd/es/theme/interface';
import { camelCase } from 'lodash-es';

import { ColorScaleItem, colorScales } from '@/styles/colors';
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
  scale[appearance].forEach((color, index) => {
    if (index === 0 || index === 12) return;
    colorStepPalette[`${name}${index}`] = color;
  });
  scale[`${appearance}A`].forEach((color, index) => {
    if (index === 0 || index === 12) return;
    colorStepPalette[`${name}${index}A`] = color;
  });
  return {
    ...colorStepPalette,
    ...generateColorPalette({ name, scale, appearance }),
  };
};

// @ts-ignore
export const generateCustomToken: GetCustomToken<LobeCustomToken> = ({ isDarkMode, token }) => {
  let colorCustomToken: any = {};
  Object.entries(colorScales).forEach(([type, scale]) => {
    colorCustomToken = {
      ...colorCustomToken,
      ...generateCustomColorPalette({
        name: camelCase(type),
        scale,
        appearance: isDarkMode ? 'dark' : 'light',
      }),
    };
  });

  const gradientColor1 = colorScales.blue.darkA[8];
  const gradientColor2 = isDarkMode ? colorScales.magenta.darkA[8] : colorScales.cyan.darkA[8];
  const gradientColor3 = colorScales.purple.darkA[8];
  const colorSolid = isDarkMode ? '#fff' : '#000';

  return {
    ...token,
    ...colorCustomToken,
    headerHeight: 64,
    footerHeight: 300,
    sidebarWidth: 240,
    tocWidth: 176,
    contentMaxWidth: 1152,
    colorSolid,
    gradientColor1,
    gradientColor2,
    gradientColor3,
    gradientHeroBgG: `radial-gradient(at 80% 20%, ${gradientColor1} 0%, ${gradientColor2} 80%, ${gradientColor3} 130%)`,
  };
};
