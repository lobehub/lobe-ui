import { colorScales } from '@/styles/colors';
import { neutralColorScales } from '@/styles/neutralColors';

export const primaryColors = {
  blue: colorScales.blue.dark[9],
  cyan: colorScales.cyan.dark[9],
  geekblue: colorScales.geekblue.dark[9],
  gold: colorScales.gold.dark[9],
  green: colorScales.green.dark[9],
  lime: colorScales.lime.dark[9],
  magenta: colorScales.magenta.dark[9],
  orange: colorScales.orange.dark[9],
  purple: colorScales.purple.dark[9],
  red: colorScales.red.dark[9],
  volcano: colorScales.volcano.dark[9],
  yellow: colorScales.yellow.dark[9],
};

export type PrimaryColorsObj = typeof primaryColors;
export type PrimaryColors = keyof PrimaryColorsObj;
export const primaryColorsSwatches = [
  primaryColors.red,
  primaryColors.orange,
  primaryColors.gold,
  primaryColors.yellow,
  primaryColors.lime,
  primaryColors.green,
  primaryColors.cyan,
  primaryColors.blue,
  primaryColors.geekblue,
  primaryColors.purple,
  primaryColors.magenta,
  primaryColors.volcano,
];
export const neutralColors = {
  mauve: neutralColorScales.mauve.dark[9],
  olive: neutralColorScales.olive.dark[9],
  sage: neutralColorScales.sage.dark[9],
  sand: neutralColorScales.sand.dark[9],
  slate: neutralColorScales.slate.dark[9],
};
export const neutralColorsSwatches = [
  neutralColors.mauve,
  neutralColors.slate,
  neutralColors.sage,
  neutralColors.olive,
  neutralColors.sand,
];

export type NeutralColorsObj = typeof neutralColors;
export type NeutralColors = keyof NeutralColorsObj;

export const findCustomThemeName = (type: 'primary' | 'neutral', value: string) => {
  const res = type === 'primary' ? primaryColors : neutralColors;
  const result = Object.entries(res).find((item) => item[1] === value);
  return result?.[0];
};
