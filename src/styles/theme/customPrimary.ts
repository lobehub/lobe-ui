import chroma from 'chroma-js';

import { colorScales } from '@/color/colors';
import type { ColorScaleItem } from '@/color/types';

import { type PrimaryColors, primaryColors } from '../customTheme';

export type CustomPrimaryColor = `#${string}`;
export type LobePrimaryColor = PrimaryColors | CustomPrimaryColor;

const HEX = /^#[\da-f]{6}$/i;

export const isCustomPrimaryColor = (value?: string): value is CustomPrimaryColor =>
  !!value && HEX.test(value);

const ANCHOR = 9;
const ANCHORED_STEPS = new Set([7, 8, 10]);
const MAX_CHROMA_RATIO = 2;

const oklch = (color: string) => {
  const [l, c, h] = chroma(color).oklch();
  return { c, h: Number.isNaN(h) ? 0 : h, l };
};

const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

const nearestPreset = (hue: number) =>
  (Object.keys(primaryColors) as PrimaryColors[]).reduce((best, name) =>
    hueDistance(oklch(primaryColors[name]).h, hue) < hueDistance(oklch(primaryColors[best]).h, hue)
      ? name
      : best,
  );

const clamp = (value: number) => Math.min(1, Math.max(0, value));

type Steps = ColorScaleItem['light'];

const retintSolid = (steps: Steps, target: ReturnType<typeof oklch>, hex: string): Steps => {
  const anchor = oklch(steps[ANCHOR]);
  const ratio = anchor.c > 0 ? Math.min(target.c / anchor.c, MAX_CHROMA_RATIO) : 0;

  return steps.map((step, i) => {
    if (i === ANCHOR) return hex;
    const { c, l } = oklch(step);
    const lightness = ANCHORED_STEPS.has(i) ? clamp(target.l + l - anchor.l) : l;
    return chroma.oklch(lightness, c * ratio, target.h).hex();
  }) as Steps;
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
  const preset = colorScales[nearestPreset(target.h)];
  const scale: ColorScaleItem = {
    dark: retintSolid(preset.dark, target, hex),
    darkA: retintAlpha(preset.darkA, preset.dark, target),
    light: retintSolid(preset.light, target, hex),
    lightA: retintAlpha(preset.lightA, preset.light, target),
  };

  cache.set(hex, scale);
  return scale;
};
