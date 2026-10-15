import chroma from 'chroma-js';

export interface Hsva {
  a: number;
  h: number;
  s: number;
  v: number;
}

export const parseColor = (value: string | undefined, fallbackHue = 0): Hsva => {
  if (!value || !chroma.valid(value)) return { a: 1, h: fallbackHue, s: 0, v: 0 };
  const color = chroma(value);
  const [h, s, v] = color.hsv();
  return { a: color.alpha(), h: Number.isNaN(h) ? fallbackHue : h, s, v };
};

export const formatColor = ({ a, h, s, v }: Hsva, alpha: boolean): string =>
  chroma
    .hsv(h, s, v)
    .alpha(alpha ? a : 1)
    .hex(alpha ? 'rgba' : 'rgb');

export const normalizeHexInput = (input: string): string | null => {
  const raw = input.trim().replace(/^#/, '');
  if (!/^([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(raw)) return null;
  return `#${raw.toLowerCase()}`;
};

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export const toRgb = ({ h, s, v }: Hsva): [number, number, number] => {
  const [r, g, b] = chroma.hsv(h, s, v).rgb();
  return [r, g, b];
};

export const toHsl = (hsva: Hsva): [number, number, number] => {
  const [h, s, l] = chroma.hsv(hsva.h, hsva.s, hsva.v).hsl();
  return [Math.round(Number.isNaN(h) ? hsva.h : h), Math.round(s * 100), Math.round(l * 100)];
};

export const fromRgb = ([r, g, b]: [number, number, number], current: Hsva): Hsva => ({
  ...parseColor(chroma.rgb(r, g, b).hex(), current.h),
  a: current.a,
});

export const fromHsl = ([h, s, l]: [number, number, number], current: Hsva): Hsva => ({
  ...parseColor(chroma.hsl(h, s / 100, l / 100).hex(), h),
  a: current.a,
});
