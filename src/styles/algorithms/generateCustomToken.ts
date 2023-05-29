import { ColorScaleItem, colorScales } from '@/styles/colors';
import { LobeCustomToken } from '@/types/customToken';
import { GetCustomToken } from 'antd-style';
import { AliasToken } from 'antd/es/theme/interface';
import { camelCase } from 'lodash';

const generateColorPalette = ({
  name,
  scale,
  appearance,
}: {
  name: string;
  scale: ColorScaleItem;
  appearance: 'light' | 'dark';
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
  name: string;
  scale: ColorScaleItem;
  appearance: 'light' | 'dark';
}): Partial<AliasToken> => {
  const colorStepPalette: { [key: string]: string } = {};
  scale[appearance].forEach((color, index) => {
    colorStepPalette[`${name}${index + 1}`] = color;
  });
  scale[`${appearance}A`].forEach((color, index) => {
    colorStepPalette[`${name}${index + 1}A`] = color;
  });
  return {
    ...colorStepPalette,
    ...generateColorPalette({ name, scale, appearance }),
  };
};

// @ts-ignore
export const generateCustomToken: GetCustomToken<LobeCustomToken> = ({ isDarkMode }) => {
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
