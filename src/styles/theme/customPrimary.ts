import chroma from 'chroma-js';

import { colorScales, gray } from '@/color/colors';
import type { ColorScaleItem } from '@/color/types';

import { type PrimaryColors, primaryColors } from '../customTheme';

export type CustomPrimaryColor = `#${string}`;
export type LobePrimaryColor = PrimaryColors | CustomPrimaryColor;

const HEX = /^#[\da-f]{6}$/i;

export const isCustomPrimaryColor = (value?: string): value is CustomPrimaryColor =>
  !!value && HEX.test(value);

const ANCHOR = 9;
const SHIFT_WEIGHT = [0, 0, 0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 0.5, 0];
const MIN_STEP_GAP = 0.015;
const LIGHTNESS_WEIGHT = 100;
const MAX_CHROMA_RATIO = 2;
const DARK_SURFACE = gray.dark[1];
const MIN_DARK_CONTRAST = 4.5;

const oklch = (color: string) => {
  const [l, c, h] = chroma(color).oklch();
  return { c, h: Number.isNaN(h) ? 0 : h, l };
};

const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

const presetDistance = (name: PrimaryColors, target: ReturnType<typeof oklch>) => {
  const preset = oklch(primaryColors[name]);
  return hueDistance(preset.h, target.h) + LIGHTNESS_WEIGHT * Math.abs(preset.l - target.l);
};

const nearestPreset = (target: ReturnType<typeof oklch>) =>
  (Object.keys(primaryColors) as PrimaryColors[]).reduce((best, name) =>
    presetDistance(name, target) < presetDistance(best, target) ? name : best,
  );

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const readableOnDark = (hex: string) => {
  const { c, h, l } = oklch(hex);
  let lightness = l;
  let color = hex;
  while (chroma.contrast(color, DARK_SURFACE) < MIN_DARK_CONTRAST && lightness < 1) {
    lightness = Math.min(1, lightness + 0.005);
    color = chroma.oklch(lightness, c, h).hex();
  }
  return color;
};

const orderLightness = (lightness: number[], direction: 1 | -1) => {
  const ordered = [...lightness];
  for (let i = ANCHOR + 1; i < ordered.length; i++)
    ordered[i] =
      direction > 0
        ? Math.max(ordered[i], ordered[i - 1] + MIN_STEP_GAP)
        : Math.min(ordered[i], ordered[i - 1] - MIN_STEP_GAP);
  for (let i = ANCHOR - 1; i >= 0; i--)
    ordered[i] =
      direction > 0
        ? Math.min(ordered[i], ordered[i + 1] - MIN_STEP_GAP)
        : Math.max(ordered[i], ordered[i + 1] + MIN_STEP_GAP);
  return ordered.map(clamp);
};

type Steps = ColorScaleItem['light'];

const retintSolid = (
  steps: Steps,
  target: ReturnType<typeof oklch>,
  hex: string,
  direction: 1 | -1,
): Steps => {
  const anchor = oklch(steps[ANCHOR]);
  const ratio = anchor.c > 0 ? Math.min(target.c / anchor.c, MAX_CHROMA_RATIO) : 0;
  const shift = target.l - anchor.l;
  const source = steps.map(oklch);
  const lightness = orderLightness(
    source.map(({ l }, i) => (i === ANCHOR ? target.l : l + SHIFT_WEIGHT[i] * shift)),
    direction,
  );

  return source.map(({ c }, i) =>
    i === ANCHOR ? hex : chroma.oklch(lightness[i], c * ratio, target.h).hex(),
  ) as Steps;
};

const retintAlpha = (steps: Steps, solid: Steps, target: ReturnType<typeof oklch>): Steps => {
  const anchor = oklch(solid[ANCHOR]);
  const ratio = anchor.c > 0 ? Math.min(target.c / anchor.c, MAX_CHROMA_RATIO) : 0;

  return steps.map((step) => {
    const color = chroma(step);
    const { c, l } = oklch(step);
    return chroma
      .oklch(l, c * ratio, target.h)
      .alpha(color.alpha())
      .css();
  }) as Steps;
};

const cache = new Map<string, ColorScaleItem>();

export const generatePrimaryScale = (color: CustomPrimaryColor): ColorScaleItem => {
  const hex = color.toLowerCase();
  const cached = cache.get(hex);
  if (cached) return cached;

  const target = oklch(hex);
  const preset = colorScales[nearestPreset(target)];
  const darkHex = readableOnDark(hex);
  const darkTarget = oklch(darkHex);
  const scale: ColorScaleItem = {
    dark: retintSolid(preset.dark, darkTarget, darkHex, 1),
    darkA: retintAlpha(preset.darkA, preset.dark, darkTarget),
    light: retintSolid(preset.light, target, hex, -1),
    lightA: retintAlpha(preset.lightA, preset.light, target),
  };

  cache.set(hex, scale);
  return scale;
};
