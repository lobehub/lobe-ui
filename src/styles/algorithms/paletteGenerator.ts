import chroma from 'chroma-js';
import { merge } from 'lodash';

export interface Color {
  hex: string;
  oklch: [number, number, number];
}

/**
 * @title 阴影参数
 */
interface AdjustParams {
  /**
   * @title 步骤
   * @description 阴影的层数，即需要生成几个阴影层，默认为 5。
   */
  steps: number;
  /**
   * @title 目标亮度
   * @description 阴影的最终亮度值，取值范围为 0~255，默认为 0。
   */
  targetBrightness: number;
  /**
   * @title 色相调整
   * @description 调整阴影颜色的色相值，取值范围为 -180~180，默认为 0。
   */
  hueAdjustment: number;
  /**
   * @title 饱和度调整
   * @description 调整阴影颜色的饱和度值，取值范围为 -100~100，默认为 0。
   */
  saturationAdjustment: number;
  /**
   * @title 饱和度缩放
   * @description 缩放阴影颜色的饱和度值，取值范围为 0~1，默认为 1。
   */
  saturationScale: number;
}

export interface ColorPaletteOptions {
  lighter?: Partial<AdjustParams>;
  darker?: Partial<AdjustParams>;
  reverse?: boolean;
}

export type TokenType = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'grey' | 'neutral';

export type ColorPalettes = Record<TokenType, string[]>;
export type SeedColors = Record<TokenType, string>;

const defaultLight: AdjustParams = {
  steps: 6,
  targetBrightness: 0.98,
  saturationAdjustment: 0.4,
  saturationScale: 1.6,
  hueAdjustment: 1,
};

const defaultDark: AdjustParams = {
  steps: 4,
  targetBrightness: 0.3,
  saturationAdjustment: 0.6,
  saturationScale: 1.6,
  hueAdjustment: 1.03,
};

// 生成 OKLCH 色板
export const generateColorPalette = (
  baseColorHex: string,
  options: ColorPaletteOptions = {},
): Color[] => {
  const lighter = merge({}, defaultLight, options.lighter);

  const darker = merge({}, defaultDark, options.darker);

  const baseColor = chroma(baseColorHex);
  const baseColorOKLCH = baseColor.oklch();

  const colorPalette: Color[] = [];

  for (let i = lighter.steps; i > 0; i--) {
    const lightness =
      baseColorOKLCH[0] + ((lighter.targetBrightness - baseColorOKLCH[0]) / lighter.steps) * i;

    const chromaValue =
      baseColorOKLCH[1] -
      (((1 - lighter.saturationAdjustment) * lighter.saturationScale * baseColorOKLCH[1]) /
        lighter.steps) *
        i;

    const newColor = chroma.oklch(lightness, chromaValue, baseColorOKLCH[2]);
    colorPalette.push({ hex: newColor.hex(), oklch: newColor.oklch() });
  }

  colorPalette.push({ hex: baseColorHex, oklch: baseColorOKLCH });

  for (let i = 1; i <= darker.steps; i++) {
    const lightness =
      baseColorOKLCH[0] - ((baseColorOKLCH[0] - darker.targetBrightness) / darker.steps) * i;
    const chromaValue =
      baseColorOKLCH[1] -
      (((1 - darker.saturationAdjustment) * darker.saturationScale * baseColorOKLCH[1]) /
        darker.steps) *
        i;

    // 色相调整因子
    let hue = baseColorOKLCH[2] * darker.hueAdjustment;

    // 确保色相值在 0 到 360 之间
    if (hue > 360) {
      hue = hue % 360;
    } else if (hue < 0) {
      hue = 360 + (hue % 360);
    }

    const newColor = chroma.oklch(lightness, chromaValue, hue);
    colorPalette.push({ hex: newColor.hex(), oklch: newColor.oklch() });
  }

  return options.reverse ? colorPalette.reverse() : colorPalette;
};

export interface NeutralPaletteOptions {
  lighter?: Partial<AdjustParams>;
  darker?: Partial<AdjustParams>;
  reverse?: boolean;
  neutral?: boolean;
}

export const generateNeutralPalette = (
  baseColorHex: string,
  options: NeutralPaletteOptions = {},
): Color[] => {
  const baseColor = chroma(baseColorHex);
  const baseColorOKLCH = baseColor.oklch();

  // 计算中性颜色的色相
  const neutralHue = baseColorOKLCH[2];

  // 将主色的饱和度降低以获得中性颜色
  const neutralChromaValue = options.neutral ? baseColorOKLCH[1] * 0.2 : 0;

  // 使用降低饱和度的颜色作为基础色重新生成色板
  const neutralBaseColor = chroma.oklch(baseColorOKLCH[0], neutralChromaValue, neutralHue);

  return generateColorPalette(neutralBaseColor.hex(), options);
};
