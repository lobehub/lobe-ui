import chroma from 'chroma-js';

import { gray } from '@/color/colors';
import { neutralColorScales } from '@/color/neutrals';
import type { ColorScaleItem } from '@/color/types';

import type { NeutralColors } from '../customTheme';
import { notifyPaletteChange } from './customPalette';
import { neutralText,type NeutralTextLadder } from './token/neutralText';

/** Any 6-digit hex: tints the default gray ladder with its hue and chroma. */
export type CustomNeutralColor = `#${string}`;
/** A preset, a 6-digit hex, or a name registered with `registerLobeNeutral`. */
export type LobeNeutralColor = NeutralColors | CustomNeutralColor | (string & {});

export interface LobeNeutralScale {
  /** Full 13-step scale (light / dark solid + alpha), same shape as the presets. */
  scale: ColorScaleItem;
  /** Text ladder [text, secondary, tertiary, quaternary]; defaults to the scale's steps 12/10/8/6. */
  text?: Partial<NeutralTextLadder>;
}

export interface ResolvedNeutral {
  scale: ColorScaleItem;
  text: NeutralTextLadder;
}

const HEX = /^#[\da-f]{6}$/i;
const NAME = /^[\w-]+$/;
// Neutrals stay neutral: presets peak around 0.02 oklch chroma.
const MAX_CHROMA = 0.05;

export const isCustomNeutralColor = (value?: string): value is CustomNeutralColor =>
  !!value && HEX.test(value);

const registry = new Map<string, LobeNeutralScale>();

export const isRegisteredNeutral = (name?: string): name is string => !!name && registry.has(name);

/**
 * Register a full custom neutral scale under `name`, then select it with
 * `setLobeTheme({ neutralColor: name })` / `ThemeScope` / `LobeThemeScript`.
 */
export const registerLobeNeutral = (name: string, neutral: LobeNeutralScale | ColorScaleItem) => {
  if (!NAME.test(name))
    throw new Error(`Invalid neutral name "${name}": use letters, digits, _ or -`);
  if (name in neutralColorScales) throw new Error(`"${name}" is a built-in neutral preset`);
  registry.set(name, 'scale' in neutral ? neutral : { scale: neutral });
  notifyPaletteChange();
};

const tint = (color: string, h: number, c: number) => {
  const source = chroma(color);
  const [l] = source.oklch();
  return chroma.oklch(l, c, h).alpha(source.alpha());
};

const tintSteps = <T extends readonly string[]>(steps: T, h: number, c: number, alpha: boolean) =>
  steps.map((step) => (alpha ? tint(step, h, c).css() : tint(step, h, c).hex())) as unknown as T;

const cache = new Map<string, ResolvedNeutral>();

/** Same construction as the presets: the gray ladder's lightness, retinted to the hex's hue. */
export const generateNeutralScale = (color: CustomNeutralColor): ResolvedNeutral => {
  const hex = color.toLowerCase();
  const cached = cache.get(hex);
  if (cached) return cached;

  const [, rawC, rawH] = chroma(hex).oklch();
  const h = Number.isNaN(rawH) ? 0 : rawH;
  const c = Math.min(rawC || 0, MAX_CHROMA);
  const base = neutralText.gray;
  const result: ResolvedNeutral = {
    scale: {
      dark: tintSteps(gray.dark, h, c, false),
      darkA: tintSteps(gray.darkA, h, c, true),
      light: tintSteps(gray.light, h, c, false),
      lightA: tintSteps(gray.lightA, h, c, true),
    },
    text: {
      dark: tintSteps(base.dark, h, c, false),
      light: tintSteps(base.light, h, c, false),
    },
  };

  cache.set(hex, result);
  return result;
};

const ladderOf = (scale: ColorScaleItem, appearance: 'light' | 'dark') => {
  const s = scale[appearance];
  return [s[12], s[10], s[8], s[6]] as [string, string, string, string];
};

export const resolveNeutral = (neutralColor?: LobeNeutralColor): ResolvedNeutral => {
  if (isCustomNeutralColor(neutralColor)) return generateNeutralScale(neutralColor);
  const registered = neutralColor ? registry.get(neutralColor) : undefined;
  if (registered)
    return {
      scale: registered.scale,
      text: {
        dark: registered.text?.dark ?? ladderOf(registered.scale, 'dark'),
        light: registered.text?.light ?? ladderOf(registered.scale, 'light'),
      },
    };
  const preset =
    neutralColor && neutralColor in neutralColorScales
      ? (neutralColor as NeutralColors)
      : undefined;
  return {
    scale: (preset && neutralColorScales[preset]) || gray,
    text: neutralText[preset || 'gray'],
  };
};

/** True when the value needs its own injected stylesheet (not a built-in preset). */
export const isCustomNeutral = (value?: string): value is string =>
  isCustomNeutralColor(value) || isRegisteredNeutral(value);
