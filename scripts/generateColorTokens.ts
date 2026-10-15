import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { argbFromHex, Hct, hexFromArgb } from '@material/material-color-utilities';

import { gray } from '../src/color/colors';
import { neutralColorScales } from '../src/color/neutrals';
import type { ColorScaleItem } from '../src/color/types';

type Appearance = 'light' | 'dark';
type Status = 'error' | 'warning' | 'info' | 'success';

const statuses: Status[] = ['error', 'warning', 'info', 'success'];

const MASTER_HUE: Record<Appearance, Record<Status, number>> = {
  dark: { error: 22, info: 252, success: 132, warning: 80 },
  light: { error: 31, info: 262, success: 149, warning: 80 },
};

const ORIGINAL_BASE: Record<Appearance, Record<Status, string>> = {
  dark: { error: '#f4416c', info: '#60b1ff', success: '#c4f042', warning: '#ffb224' },
  light: { error: '#ec5e41', info: '#0072f5', success: '#379d4a', warning: '#ee9e0b' },
};

const LADDER: Record<
  Appearance,
  { base: number; chroma: number[]; shift: number[]; tone: number[] }
> = {
  dark: {
    base: 66,
    chroma: [30, 36, 42, 48, 56, 64, 70, 74, 72, 44, 20],
    shift: [0, 0, 0, 0, 0, 0.5, 1, 1, 1, 0.5, 0],
    tone: [9, 16, 23, 34, 42, 48, 54, 60, 66, 82, 92],
  },
  light: {
    base: 60,
    chroma: [6, 10, 15, 20, 28, 38, 52, 66, 76, 72, 62],
    shift: [0, 0, 0, 0, 0, 0, 0.5, 1, 1, 1, 0.5],
    tone: [98, 96, 93.5, 91, 87, 82, 75, 67, 60, 48, 36],
  },
};

const BASE_TONE: Record<Appearance, number> = { dark: 66, light: 61 };
const DARK_BASE_TONE_MAX = 74;
const WARNING_TONE_LIFT = 7;

const PULL_WEIGHT: Record<Appearance, number[]> = {
  dark: [0, 0, 0, 0, 0, 0.5, 1, 1, 1, 0.5, 0],
  light: [0, 0, 0, 0, 0.1, 0.25, 0.5, 0.75, 1, 0, 0],
};

const LIFT_WEIGHT: Record<Appearance, number[]> = {
  dark: [0, 0, 0, 0, 0, 0, 1, 1, 1, 0.5, 0],
  light: PULL_WEIGHT.light,
};

const LIGHT_HUE_OFFSET: Record<Status, number[]> = {
  error: [-4, -4, -4, -2, -2, -1, -1, -1, 0, 3, 6],
  info: [-10, -12, -7, -7, -5, -4, -3, -2, 0, 4, 8],
  success: [-7, -6, -4, -4, -3, -2, 0, 1, 0, 9, 15],
  warning: [-1, -1, -1, 1, 2, 2, 3, 3, 0, 4, 7],
};

const DARK_HUE_CURVE: Record<Status, [tone: number, offset: number][]> = {
  error: [
    [7.9, -0.9],
    [12.8, -6.5],
    [16.5, -5.9],
    [21.1, -5],
    [26.7, -3.7],
    [34.4, -1.9],
    [44.8, -0.1],
    [54.2, 0],
    [72.8, 1.7],
    [87.7, -0.7],
  ],
  info: [
    [6.6, -0.4],
    [8.7, 4.8],
    [15.8, 0.6],
    [21, 0.9],
    [26.5, -1.2],
    [32.2, -0.4],
    [38.9, 0.1],
    [46.6, 0.2],
    [59.1, 0],
    [72.9, -6.6],
    [89.5, -21.8],
  ],
  success: [
    [6.1, 15.3],
    [8.5, 6.6],
    [15.4, 4.9],
    [21.6, 3.9],
    [27.3, 3.4],
    [33.2, 2.8],
    [39.3, 2.4],
    [45.9, 1.6],
    [61.3, 0],
    [76.2, 1.8],
    [90.6, 0.7],
  ],
  warning: [
    [8.6, -1.2],
    [13.7, -10.7],
    [18, -10.6],
    [22.6, -11.6],
    [28.4, -9.3],
    [36.3, -10],
    [45.7, -11.7],
    [82.7, 0],
    [83.7, 5.3],
    [92.4, 4],
  ],
};

// Yellow cannot hold chroma below tone ~65 in sRGB and turns brown, so light warning text keeps its own anchor.
const LIGHT_TEXT_OVERRIDE: Partial<Record<Status, { chroma: number; hue: number; tone: number }>> =
  {
    warning: { chroma: 80, hue: 74, tone: 65 },
  };

const NEUTRAL_TEXT_TONE: Record<Appearance, number[]> = {
  dark: [91.3, 73.3, 59.4, 45.2],
  light: [11.8, 43.2, 57.5, 71.8],
};

const hueDelta = (a: number, b: number) => ((a - b + 540) % 360) - 180;

const toneOf = (hex: string) => Hct.fromInt(argbFromHex(hex)).tone;

const interpolate = (points: [number, number][], tone: number) => {
  if (tone <= points[0][0]) return points[0][1];
  const last = points.at(-1)!;
  if (tone >= last[0]) return last[1];
  const index = points.findIndex(([t]) => tone <= t);
  const [t0, o0] = points[index - 1];
  const [t1, o1] = points[index];
  return o0 + ((o1 - o0) * (tone - t0)) / (t1 - t0);
};

const solve = (hue: number, chroma: number, tone: number) => {
  const target = (hue + 360) % 360;
  let c = chroma;
  let color = Hct.from(target, c, tone);
  while (c > 0 && Math.abs(hueDelta(color.hue, target)) > 8) {
    c -= 0.5;
    color = Hct.from(target, c, tone);
  }
  return hexFromArgb(color.toInt());
};

const generateRamp = (status: Status, appearance: Appearance) => {
  const ladder = LADDER[appearance];
  const shift = BASE_TONE[appearance] - ladder.base;
  const baseTone = ladder.tone[8] + ladder.shift[8] * shift;
  let pull = toneOf(ORIGINAL_BASE[appearance][status]) - baseTone;
  if (appearance === 'dark') pull = Math.min(pull, DARK_BASE_TONE_MAX - baseTone);
  const lift = status === 'warning' ? WARNING_TONE_LIFT : 0;
  const mainTone = baseTone + pull + lift * LIFT_WEIGHT[appearance][8];
  const hue = MASTER_HUE[appearance][status];

  return ladder.tone.map((t0, i) => {
    const override = LIGHT_TEXT_OVERRIDE[status];
    if (appearance === 'light' && i === 9 && override)
      return solve(override.hue, override.chroma, override.tone);

    let tone =
      t0 +
      ladder.shift[i] * shift +
      PULL_WEIGHT[appearance][i] * pull +
      lift * LIFT_WEIGHT[appearance][i];
    if (appearance === 'light' && i === 9) tone = Math.min(tone, mainTone - 8);
    tone = Math.max(1, Math.min(99.5, tone));
    const offset =
      appearance === 'light'
        ? LIGHT_HUE_OFFSET[status][i]
        : interpolate(DARK_HUE_CURVE[status], tone);
    return solve(hue + offset, ladder.chroma[i], tone);
  });
};

const isChannel = (value: number) => value >= 0 && value <= 255;

const channels = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

const alphaOver = (front: string, back: string) => {
  const f = channels(front);
  const b = channels(back);
  for (let step = 1; step <= 100; step++) {
    const alpha = step / 100;
    const rgb = f.map((c, i) => Math.round((c - b[i] * (1 - alpha)) / alpha));
    if (rgb.every(isChannel)) {
      return alpha === 1 ? front : `rgba(${rgb.join(', ')}, ${alpha})`;
    }
  }
  return front;
};

export const generateStatusScale = (status: Status): ColorScaleItem => {
  const light = generateRamp(status, 'light');
  const dark = generateRamp(status, 'dark');
  const lightHue = MASTER_HUE.light[status];
  const darkHue = MASTER_HUE.dark[status];
  const lightScale = [
    '#ffffff',
    ...light,
    solve(lightHue + LIGHT_HUE_OFFSET[status][10], 40, 24),
  ] as ColorScaleItem['light'];
  const darkScale = [
    solve(darkHue, 12, 4),
    ...dark,
    solve(darkHue, 6, 98),
  ] as ColorScaleItem['dark'];
  const translucent = (scale: string[], back: string) =>
    scale.map((color, i) => (i < 10 ? alphaOver(color, back) : color)) as ColorScaleItem['light'];

  return {
    dark: darkScale,
    darkA: translucent(darkScale, '#000000'),
    light: lightScale,
    lightA: translucent(lightScale, '#ffffff'),
  };
};

export const generateNeutralText = () => {
  const scales: Record<string, ColorScaleItem> = { gray, ...neutralColorScales };
  return Object.fromEntries(
    Object.entries(scales).map(([name, scale]) => {
      const text = (appearance: Appearance) => {
        const hex = scale[appearance][9];
        const seed = Hct.fromInt(argbFromHex(hex));
        const chroma = new Set(channels(hex)).size === 1 ? 0 : seed.chroma;
        return NEUTRAL_TEXT_TONE[appearance].map((tone) =>
          hexFromArgb(Hct.from(seed.hue, chroma, tone).toInt()),
        );
      };
      return [name, { dark: text('dark'), light: text('light') }];
    }),
  );
};

const list = (values: string[], indent: string) =>
  values.map((value) => `${indent}'${value}',`).join('\n');

const inline = (values: string[]) => values.map((value) => `'${value}'`).join(', ');

export const renderStatusScale = (status: Status) => {
  const scale = generateStatusScale(status);
  const block = (key: keyof ColorScaleItem) => `  ${key}: [\n${list(scale[key], '    ')}\n  ],`;
  return `import type { ColorScaleItem } from '../types';

export const ${status}: ColorScaleItem = {
${block('dark')}
${block('darkA')}
${block('light')}
${block('lightA')}
};
`;
};

export const renderNeutralText = () => {
  const entries = Object.entries(generateNeutralText())
    .map(
      ([name, { dark, light }]) =>
        `  ${name}: {\n    dark: [${inline(dark)}],\n    light: [${inline(light)}],\n  },`,
    )
    .join('\n');
  return `export type NeutralTextLadder = Record<'dark' | 'light', [string, string, string, string]>;

export const neutralText: Record<string, NeutralTextLadder> = {
${entries}
};
`;
};

const root = path.resolve(import.meta.dirname, '..');

export const statusScalePath = (status: Status) => path.join(root, `src/color/status/${status}.ts`);

export const neutralTextPath = path.join(root, 'src/styles/theme/token/neutralText.ts');

export const statusNames = statuses;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const status of statuses) writeFileSync(statusScalePath(status), renderStatusScale(status));
  writeFileSync(neutralTextPath, renderNeutralText());
}
