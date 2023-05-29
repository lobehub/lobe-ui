import { ColorScaleItem, colorScales } from '@/styles/colors';
import { LobeCustomToken } from '@/types/customToken';
import { GetCustomToken } from 'antd-style';
import { AliasToken } from 'antd/es/theme/interface';
import { camelCase } from 'lodash';

const generateColorPalette = ({
  scale,
  appearance,
}: {
  scale: ColorScaleItem;
  appearance: 'light' | 'dark';
}) => {
  return {
    [`colorBg`]: scale[appearance][1],
    [`colorBgHover`]: scale[appearance][2],
    [`colorBorder`]: scale[appearance][4],
    [`colorBorderHover`]: scale[appearance][5],
    [`colorHover`]: scale[appearance][10],
    [`color`]: scale[appearance][9],
    [`colorActive`]: scale[appearance][7],
    [`colorTextHover`]: scale[appearance][10],
    [`colorText`]: scale[appearance][9],
    [`colorTextActive`]: scale[appearance][7],
  };
};

const generateCustomColorPalette = ({
  scale,
  appearance,
}: {
  scale: ColorScaleItem;
  appearance: 'light' | 'dark';
}): Partial<AliasToken> => {
  const colorStepPalette: { [key: string]: string } = {};
  scale[appearance].forEach((color, index) => {
    colorStepPalette[`color${index + 1}`] = color;
  });
  scale[`${appearance}A`].forEach((color, index) => {
    colorStepPalette[`color${index + 1}A`] = color;
  });
  return {
    ...colorStepPalette,
    ...generateColorPalette({ scale, appearance }),
  };
};

// @ts-ignore
export const generateCustomToken: GetCustomToken<LobeCustomToken> = ({ token, isDarkMode }) => {
  let colorCustomToken: any = {};
  Object.entries(colorScales).forEach(([type, scale]) => {
    colorCustomToken[camelCase(type)] = generateCustomColorPalette({
      scale,
      appearance: isDarkMode ? 'dark' : 'light',
    });
  });

  const gradientColor1 = colorScales.blue.darkA[8];
  const gradientColor2 = isDarkMode ? colorScales.pink.darkA[8] : colorScales.cyan.darkA[8];
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
