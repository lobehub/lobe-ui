import { type StatusColorScales, statusColorScales } from '@/color/status';
import type { ColorScaleItem } from '@/color/types';

import { generateCustomColorToken } from '../customToken';
import { generateColorPalette } from '../generateColorPalette';
import { legacyToken } from './legacy';
import { shadowToken } from './shadow';

const createStatusPalette = <T extends string>(
  appearance: 'light' | 'dark',
  scale: ColorScaleItem,
  type: T,
) => {
  const palette = generateColorPalette({ appearance, scale, type });
  if (appearance === 'dark') return palette;
  return { ...palette, [`color${type}Text`]: scale.light[10] } as typeof palette;
};

export const createPaletteToken = (
  appearance: 'light' | 'dark',
  scales: StatusColorScales = statusColorScales,
) => {
  const error = createStatusPalette(appearance, scales.error, 'Error');
  const info = createStatusPalette(appearance, scales.info, 'Info');
  const success = createStatusPalette(appearance, scales.success, 'Success');
  const warning = createStatusPalette(appearance, scales.warning, 'Warning');

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
