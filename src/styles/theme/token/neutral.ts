import { mix, parseToRgb } from 'polished';

import { gray } from '@/color/colors';
import { neutralColorScales } from '@/color/neutrals';

import type { NeutralColors } from '../../customTheme';
import { generateColorNeutralPalette } from '../generateColorPalette';

const isChannel = (value: number) => value >= 0 && value <= 255;

// port of antd's getAlphaColor: the most transparent rgba that renders `front` over `back`
const getAlphaColor = (front: string, back: string) => {
  const f = parseToRgb(front);
  if ('alpha' in f && f.alpha < 1) return front;
  const b = parseToRgb(back);

  for (let alpha = 0.01; alpha <= 1; alpha += 0.01) {
    const r = Math.round((f.red - b.red * (1 - alpha)) / alpha);
    const g = Math.round((f.green - b.green * (1 - alpha)) / alpha);
    const bl = Math.round((f.blue - b.blue * (1 - alpha)) / alpha);
    if (isChannel(r) && isChannel(g) && isChannel(bl)) {
      const a = Math.round(alpha * 100) / 100;
      return a === 1 ? `rgb(${r},${g},${bl})` : `rgba(${r},${g},${bl},${a})`;
    }
  }

  return `rgb(${f.red},${f.green},${f.blue})`;
};

export const createNeutralToken = (
  appearance: 'light' | 'dark',
  neutralColor: NeutralColors | undefined,
  status: { colorErrorBg: string; colorWarningBg: string },
) => {
  const scale = (neutralColor && neutralColorScales[neutralColor]) || gray;
  const token = generateColorNeutralPalette({ appearance, scale });

  return {
    ...token,
    colorBgContainerDisabled: token.colorFillTertiary,
    colorBgContainerSecondary: mix(0.5, token.colorBgLayout, token.colorBgContainer),
    colorBgTextActive: token.colorFill,
    colorBgTextHover: token.colorFillSecondary,
    colorBorderBg: token.colorBgContainer,
    colorErrorOutline: getAlphaColor(status.colorErrorBg, token.colorBgContainer),
    colorFillAlter: token.colorFillQuaternary,
    colorFillContent: token.colorFillSecondary,
    colorFillContentHover: token.colorFill,
    colorIcon: token.colorTextTertiary,
    colorIconHover: token.colorText,
    colorSplit: getAlphaColor(token.colorBorderSecondary, token.colorBgContainer),
    colorTextDescription: token.colorTextTertiary,
    colorTextDisabled: token.colorTextQuaternary,
    colorTextHeading: token.colorText,
    colorTextLabel: token.colorTextSecondary,
    colorTextPlaceholder: token.colorTextQuaternary,
    colorWarningOutline: getAlphaColor(status.colorWarningBg, token.colorBgContainer),
    controlItemBgActiveDisabled: token.colorFill,
    controlItemBgHover: token.colorFillTertiary,
    controlTmpOutline: token.colorFillQuaternary,
  };
};
