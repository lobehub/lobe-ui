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
