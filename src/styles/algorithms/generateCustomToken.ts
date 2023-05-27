import { ColorScaleItem, colorScales } from '@/styles/colors';
import { LobeCustomToken } from '@/types/customToken';
import { GetCustomToken } from 'antd-style';
import { AliasToken } from 'antd/es/theme/interface';
import { capitalize } from 'lodash';
import { generateColorPalette } from './generateColorPalette';

const generateCustomColorPalette = ({
  type,
  scale,
  appearance,
}: {
  type: string;
  scale: ColorScaleItem;
  appearance: 'light' | 'dark';
}): Partial<AliasToken> => {
  const name = capitalize(type);
  const colorStepPalette: { [key: string]: string } = {};
  scale[appearance].forEach((color, index) => {
    colorStepPalette[`color${name}${index + 1}`] = color;
  });
  scale[`${appearance}A`].forEach((color, index) => {
    colorStepPalette[`color${name}${index + 1}A`] = color;
  });
  return {
    ...colorStepPalette,
    ...generateColorPalette({ type, scale, appearance }),
  };
};

// @ts-ignore
export const generateCustomToken: GetCustomToken<LobeCustomToken> = ({
  appearance,
  token,
  isDarkMode,
}) => {
  const gradientColor1 = token.blue;
  const gradientColor2 = isDarkMode ? token.pink : token.cyan;
  const gradientColor3 = token.purple;
  const colorSolid = isDarkMode ? token.colorWhite : '#000';

  let colorCustomToken = {
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

  Object.entries(colorScales).forEach(([type, scale]) => {
    colorCustomToken = {
      ...colorCustomToken,
      // @ts-ignore
      ...generateCustomColorPalette({ type, scale, appearance }),
    };
  });

  return colorCustomToken;
};
