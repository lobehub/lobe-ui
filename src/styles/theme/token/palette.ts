import { blue, geekblue, gold, green, lime, red, volcano } from '@/color/colors';

import { generateCustomColorToken } from '../customToken';
import { generateColorPalette } from '../generateColorPalette';
import { legacyToken } from './legacy';
import { shadowToken } from './shadow';

const statusScales = {
  dark: { error: red, info: blue, success: lime, warning: gold },
  light: { error: volcano, info: geekblue, success: green, warning: gold },
};

export const createPaletteToken = (appearance: 'light' | 'dark') => {
  const scales = statusScales[appearance];
  const error = generateColorPalette({ appearance, scale: scales.error, type: 'Error' });
  const info = generateColorPalette({ appearance, scale: scales.info, type: 'Info' });
  const success = generateColorPalette({ appearance, scale: scales.success, type: 'Success' });
  const warning = generateColorPalette({ appearance, scale: scales.warning, type: 'Warning' });

  return {
    ...legacyToken[appearance],
    ...error,
    ...info,
    ...success,
    ...warning,
    ...generateCustomColorToken(appearance === 'dark'),
    ...shadowToken[appearance],
    colorErrorAffix: error.colorError,
    colorHighlight: error.colorError,
    colorLink: info.colorInfoText,
    colorLinkActive: info.colorInfoTextActive,
    colorLinkHover: info.colorInfoTextHover,
    colorWarningAffix: warning.colorWarning,
  };
};
