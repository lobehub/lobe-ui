import { colors } from '@lobehub/ui';
import { GetCustomToken } from 'antd-style';

export interface SiteCustomToken {
  colorSolid: string;
  contentMaxWidth: number;
  footerHeight: number;
  gradientColor1: string;
  gradientColor2: string;
  gradientColor3: string;
  gradientHeroBgG: string;
  headerHeight: number;
  sidebarWidth: number;
  tocWidth: number;
}

const generateCustomToken: GetCustomToken<SiteCustomToken> = ({ isDarkMode }) => {
  const gradientColor1 = colors.blue.darkA[8];
  const gradientColor2 = isDarkMode ? colors.magenta.darkA[8] : colors.cyan.darkA[8];
  const gradientColor3 = colors.purple.darkA[8];
  const colorSolid = isDarkMode ? '#fff' : '#000';

  return {
    colorSolid,
    contentMaxWidth: 960,
    footerHeight: 300,
    gradientColor1,
    gradientColor2,
    gradientColor3,
    gradientHeroBgG: `radial-gradient(at 80% 20%, ${gradientColor1} 0%, ${gradientColor2} 80%, ${gradientColor3} 130%)`,
    headerHeight: 64,
    sidebarWidth: 240,
    tocWidth: 176,
  };
};

export default generateCustomToken;
