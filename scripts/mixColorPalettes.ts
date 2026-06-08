import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import chroma from 'chroma-js';

type Palette = Record<string, string[]>;

type Options = {
  inputA: string;
  inputB: string;
  name?: string;
  output: string;
  ratio: number;
};

const paletteKeys = ['dark', 'darkA', 'light', 'lightA'];
const alphaFixedBackgroundMap: Partial<Record<(typeof paletteKeys)[number], string>> = {
  darkA: '#000000',
  lightA: '#ffffff',
};

const parseArgs = (): Options => {
  const args = process.argv.slice(2);
  const options: Partial<Options> = {
    ratio: 0.5,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    if (!arg) continue;

    if ((arg === '--input-a' || arg === '-a') && next) {
      options.inputA = next;
      i++;
      continue;
    }

    if ((arg === '--input-b' || arg === '-b') && next) {
      options.inputB = next;
      i++;
      continue;
    }

    if ((arg === '--ratio' || arg === '-r') && next) {
      const ratio = Number(next);
      if (Number.isNaN(ratio) || ratio < 0 || ratio > 1) {
        throw new Error(`Invalid ratio value: ${next}. Ratio should be between 0 and 1.`);
      }

      options.ratio = ratio;
      i++;
      continue;
    }

    if ((arg === '--output' || arg === '-o') && next) {
      options.output = resolve(next);
      i++;
      continue;
    }

    if ((arg === '--name' || arg === '-n') && next) {
      options.name = next;
      i++;
      continue;
    }
  }

  if (!options.inputA || !options.inputB || !options.output) {
    throw new Error(
      'Usage: tsx scripts/mixColorPalettes.ts --input-a <a|a.ts> --input-b <b|b.ts> --output <output.ts> [--ratio 0.5] [--name <paletteName>]',
    );
  }

  return options as Options;
};

const resolveInputPath = (input: string) => {
  if (input.endsWith('.ts') || input.includes('/')) {
    return resolve(input);
  }

  return resolve('src/color/colors', `${input}.ts`);
};

const ensureFileExists = (path: string) => {
  if (!existsSync(path)) {
    throw new Error(`Palette file not found: ${path}`);
  }
};

const readPaletteName = (sourcePath: string) => {
  const source = readFileSync(sourcePath, 'utf8');
  const matched = source.match(/const\s+([A-Za-z0-9_$]+)\s*:\s*ColorScaleItem\s*=/);
  return matched?.[1];
};

const toIdentifier = (raw: string) => {
  const cleaned = raw
    .replace(/^[^A-Za-z_$]+/, '')
    .replaceAll(/[^A-Za-z0-9_$]+([A-Za-z0-9_$])/g, (_, char: string) => char.toUpperCase())
    .replaceAll(/[^A-Za-z0-9_$]/g, '');

  return cleaned || 'mixedPalette';
};

const rgbaPattern = /^rgba\(\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([0-9]*\.?[0-9]+)\s*\)$/i;

const isRgbaColor = (value: string) => rgbaPattern.test(value);
const isStableColor = (color: number) => color >= 0 && color <= 255;

const arrayToRgb = (rgbArray: number[]) =>
  rgbArray.length < 4 ? `rgb(${rgbArray.join(',')})` : `rgba(${rgbArray.join(',')})`;

const formatAlpha = (alpha: number) => Number(alpha.toFixed(2)).toString().replace(/\.0+$/, '');

const toRgbaString = (color: chroma.Color) => {
  const [r, g, b, a] = color.rgba();
  const rr = Math.round(r);
  const gg = Math.round(g);
  const bb = Math.round(b);
  const aa = formatAlpha(a);
  return `rgba(${rr}, ${gg}, ${bb}, ${aa})`;
};

const mixColor = (colorA: string, colorB: string, ratio: number) => {
  const mixed = chroma.mix(colorA, colorB, ratio);
  return isRgbaColor(colorA) || isRgbaColor(colorB)
    ? toRgbaString(mixed)
    : mixed.hex('rgb').toLowerCase();
};

const getRenderedColor = (frontColor: string, backgroundColor: string) => {
  const [fR, fG, fB] = chroma(frontColor).rgb();
  const [bR, bG, bB] = chroma(backgroundColor).rgb();
  const alpha = chroma(frontColor).alpha();

  if (alpha >= 1) {
    return chroma.rgb(fR, fG, fB).hex('rgb').toLowerCase();
  }

  const r = fR * alpha + bR * (1 - alpha);
  const g = fG * alpha + bG * (1 - alpha);
  const b = fB * alpha + bB * (1 - alpha);

  return chroma.rgb(r, g, b).hex('rgb').toLowerCase();
};

const getAlphaColor = (frontColor: string, backgroundColor: string): string => {
  const [fR, fG, fB] = chroma(frontColor).rgb();
  const [bR, bG, bB] = chroma(backgroundColor).rgb();

  for (let fA = 0.01; fA <= 1; fA += 0.01) {
    const r = Math.round((fR - bR * (1 - fA)) / fA);
    const g = Math.round((fG - bG * (1 - fA)) / fA);
    const b = Math.round((fB - bB * (1 - fA)) / fA);

    if (isStableColor(r) && isStableColor(g) && isStableColor(b)) {
      if (fA >= 1) {
        return chroma.rgb(r, g, b).hex('rgb').toLowerCase();
      }

      return `rgba(${r}, ${g}, ${b}, ${formatAlpha(fA)})`;
    }
  }

  return chroma(arrayToRgb([fR, fG, fB, 1]))
    .hex('rgb')
    .toLowerCase();
};

const mixAlphaColor = (
  colorA: string,
  colorB: string,
  backgroundA: string,
  backgroundB: string,
  ratio: number,
) => {
  const renderedA = getRenderedColor(colorA, backgroundA);
  const renderedB = getRenderedColor(colorB, backgroundB);
  const mixedRenderedColor = chroma.mix(renderedA, renderedB, ratio).hex('rgb').toLowerCase();
  const mixedBackground = chroma.mix(backgroundA, backgroundB, ratio).hex('rgb').toLowerCase();

  if (chroma(colorA).alpha() >= 1 && chroma(colorB).alpha() >= 1) {
    return mixedRenderedColor;
  }

  return getAlphaColor(mixedRenderedColor, mixedBackground);
};

const formatPalette = (name: string, palette: Palette) => {
  const blocks = paletteKeys
    .map((key) => {
      const values = palette[key];
      if (!values) {
        throw new Error(`Missing key "${key}" in mixed palette`);
      }

      const lines = values.map((color) => `    '${color}',`).join('\n');
      return `  ${key}: [\n${lines}\n  ],`;
    })
    .join('\n');

  return `import type { ColorScaleItem } from '../types';

const ${name}: ColorScaleItem = {
${blocks}
};

export default ${name};
`;
};

const assertPaletteShape = (palette: Palette, label: string) => {
  for (const key of paletteKeys) {
    const values = palette[key];
    if (!Array.isArray(values)) {
      throw new Error(`Palette "${label}" is missing "${key}" array`);
    }
  }
};

const main = async () => {
  const { inputA, inputB, output, ratio, name } = parseArgs();
  const pathA = resolveInputPath(inputA);
  const pathB = resolveInputPath(inputB);
  ensureFileExists(pathA);
  ensureFileExists(pathB);

  const modA = (await import(pathToFileURL(pathA).href)) as { default?: Palette };
  const modB = (await import(pathToFileURL(pathB).href)) as { default?: Palette };
  const paletteA = modA.default;
  const paletteB = modB.default;

  if (!paletteA || !paletteB) {
    throw new Error('Both source palette files must have default exports');
  }

  assertPaletteShape(paletteA, pathA);
  assertPaletteShape(paletteB, pathB);

  const mixedPalette = Object.fromEntries(
    paletteKeys.map((key) => {
      const valuesA = paletteA[key];
      const valuesB = paletteB[key];

      if (valuesA.length !== valuesB.length) {
        throw new Error(
          `Palette key "${key}" has different lengths: ${valuesA.length} vs ${valuesB.length}`,
        );
      }

      const alphaBackground = alphaFixedBackgroundMap[key];
      const mixedValues = valuesA.map((valueA, index) => {
        if (!alphaBackground) {
          return mixColor(valueA, valuesB[index], ratio);
        }

        return mixAlphaColor(valueA, valuesB[index], alphaBackground, alphaBackground, ratio);
      });

      return [key, mixedValues];
    }),
  ) as Palette;

  const paletteNameA = readPaletteName(pathA);
  const paletteNameB = readPaletteName(pathB);
  const defaultName =
    paletteNameA && paletteNameB
      ? `${paletteNameA}${paletteNameB}Mix`
      : toIdentifier(basename(output, '.ts'));

  const paletteName = name || defaultName;
  const outputContent = formatPalette(paletteName, mixedPalette);
  writeFileSync(output, outputContent, 'utf8');

  console.log(`Mixed palette generated: ${output}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
