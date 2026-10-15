import { readFileSync } from 'node:fs';

import { argbFromHex, Hct } from '@material/material-color-utilities';

import type { ColorScaleItem } from '../../../../src/color/types';
import type { NeutralColors } from '../../../../src/styles/customTheme';
import { createLobeToken } from '../../../../src/styles/theme/createLobeToken';
import type { LobePrimaryColor } from '../../../../src/styles/theme/customPrimary';
import { generateColorPalette } from '../../../../src/styles/theme/generateColorPalette';

type Appearance = 'light' | 'dark';
type RGB = [number, number, number];

const args = process.argv.slice(2);
const flag = (name: string) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};

const primaryColor = flag('primary') as LobePrimaryColor | undefined;
const neutralColor = flag('neutral') as NeutralColors | undefined;
const asJson = args.includes('--json');
const scalesPath = flag('scales');
const customScales: Partial<Record<string, ColorScaleItem>> = scalesPath
  ? JSON.parse(readFileSync(scalesPath, 'utf8'))
  : {};

const overrideScales = (appearance: Appearance) =>
  Object.fromEntries(
    Object.entries(customScales).flatMap(([name, scale]) => {
      if (!scale) return [];
      const type = name[0].toUpperCase() + name.slice(1);
      const palette: Record<string, string> = generateColorPalette({ appearance, scale, type });
      if (appearance === 'light' && type !== 'Primary')
        palette[`color${type}Text`] = scale.light[10];
      return Object.entries(palette);
    }),
  );

const parse = (value: string): [...RGB, number] => {
  const text = value.trim();
  if (text.startsWith('#')) {
    const hex =
      text.length === 4 ? Array.from(text.slice(1), (c) => c + c).join('') : text.slice(1);
    return [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16)).concat(1) as [
      ...RGB,
      number,
    ];
  }
  const [r, g, b, a = 1] = (text.match(/[\d.]+/g) ?? []).map(Number);
  return [r, g, b, a];
};

const over = (front: string, back: RGB): RGB => {
  const [r, g, b, a] = parse(front);
  return [r, g, b].map((c, i) => Math.round(c * a + back[i] * (1 - a))) as RGB;
};

const toHex = (rgb: RGB) => `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;

const linear = (c: number) => {
  const v = c / 255;
  return v <= 0.040_45 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: RGB) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const wcag = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const apcaY = ([r, g, b]: RGB) =>
  0.212_672_9 * (r / 255) ** 2.4 + 0.715_152_2 * (g / 255) ** 2.4 + 0.072_175 * (b / 255) ** 2.4;
const apca = (text: RGB, back: RGB) => {
  const clamp = (y: number) => (y > 0.022 ? y : y + (0.022 - y) ** 1.414);
  const t = clamp(apcaY(text));
  const b = clamp(apcaY(back));
  if (b > t) {
    const s = (b ** 0.56 - t ** 0.57) * 1.14;
    return s < 0.1 ? 0 : (s - 0.027) * 100;
  }
  const s = (b ** 0.65 - t ** 0.62) * 1.14;
  return s > -0.1 ? 0 : -(s + 0.027) * 100;
};

const STATUS = ['Error', 'Warning', 'Info', 'Success', 'Primary'] as const;
const ROLES = ['Bg', 'BgHover', 'Border', 'BorderHover', 'Hover', '', 'Active', 'Text'] as const;
const NEUTRAL = [
  'colorText',
  'colorTextSecondary',
  'colorTextTertiary',
  'colorTextQuaternary',
  'colorBorder',
  'colorBorderSecondary',
] as const;

const measure = (appearance: Appearance) => {
  const token = {
    ...(createLobeToken({ appearance, neutralColor, primaryColor }) as unknown as Record<
      string,
      string
    >),
    ...overrideScales(appearance),
  };
  const surface = over(token.colorBgContainer, appearance === 'dark' ? [0, 0, 0] : [255, 255, 255]);
  const read = (key: string) => {
    const rgb = over(token[key], surface);
    const { chroma, hue, tone } = Hct.fromInt(argbFromHex(toHex(rgb)));
    return {
      apca: Math.abs(apca(rgb, surface)),
      hct: [hue, chroma, tone],
      hex: toHex(rgb),
      key,
      raw: token[key],
      wcag: wcag(rgb, surface),
    };
  };
  return {
    neutral: NEUTRAL.map(read),
    status: STATUS.map((name) => ({
      name,
      roles: ROLES.map((role) => ({ role: role || 'base', ...read(`color${name}${role}`) })),
    })),
    surface: toHex(surface),
  };
};

const report = { dark: measure('dark'), light: measure('light') };

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const cell = (m: { apca: number; hct: number[]; hex: string; wcag: number }) =>
    `${m.hex} ${m.hct.map((v) => v.toFixed(0).padStart(3)).join('/')} ${m.wcag.toFixed(2).padStart(5)}:1 Lc${m.apca.toFixed(0).padStart(3)}`;
  for (const appearance of ['light', 'dark'] as const) {
    const { neutral, status, surface } = report[appearance];
    console.log(`\n── ${appearance} on colorBgContainer ${surface}   hex H/C/T wcag apca`);
    console.log('role'.padEnd(12) + status.map((s) => s.name.padEnd(40)).join(''));
    ROLES.forEach((role, i) =>
      console.log(
        (role || 'base').padEnd(12) + status.map((s) => cell(s.roles[i]).padEnd(40)).join(''),
      ),
    );
    console.log('');
    for (const m of neutral) console.log(m.key.padEnd(22), cell(m));
  }
}
