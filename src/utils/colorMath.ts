import chroma from 'chroma-js';

export interface RgbColor {
  alpha?: number;
  blue: number;
  green: number;
  red: number;
}

export const parseRgb = (color: string): RgbColor => {
  const [red, green, blue, alpha] = chroma(color).rgba();
  return alpha < 1 ? { alpha, blue, green, red } : { blue, green, red };
};

const toHex = (channel: number) => channel.toString(16).padStart(2, '0');

const toHexColor = ({ red, green, blue }: RgbColor) => {
  const hex = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
  return hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6]
    ? `#${hex[1]}${hex[3]}${hex[5]}`
    : hex;
};

// Byte-compatible with polished's mix (Sass formula, floored channels) so generated tokens stay stable.
export const mixColors = (weight: number, color: string, otherColor: string): string => {
  if (color === 'transparent') return otherColor;
  if (otherColor === 'transparent') return color;
  if (weight === 0) return otherColor;

  const first = { alpha: 1, ...parseRgb(color) };
  const second = { alpha: 1, ...parseRgb(otherColor) };

  const alphaDelta = first.alpha - second.alpha;
  const x = weight * 2 - 1;
  const y = x * alphaDelta === -1 ? x : x + alphaDelta;
  const z = 1 + x * alphaDelta;
  const weight1 = (y / z + 1) / 2;
  const weight2 = 1 - weight1;

  const mixed = {
    alpha: first.alpha * weight + second.alpha * (1 - weight),
    blue: Math.floor(first.blue * weight1 + second.blue * weight2),
    green: Math.floor(first.green * weight1 + second.green * weight2),
    red: Math.floor(first.red * weight1 + second.red * weight2),
  };

  return mixed.alpha >= 1
    ? toHexColor(mixed)
    : `rgba(${mixed.red},${mixed.green},${mixed.blue},${mixed.alpha})`;
};

export const withAlpha = (color: string, alpha: number): string => {
  const { red, green, blue } = parseRgb(color);
  return `rgba(${red},${green},${blue},${alpha})`;
};
