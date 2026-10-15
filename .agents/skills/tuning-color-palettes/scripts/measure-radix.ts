import { createRequire } from 'node:module';
import path from 'node:path';

import { argbFromHex, Hct } from '@material/material-color-utilities';

const [packageDir, ...names] = process.argv.slice(2);

if (!packageDir || names.length === 0) {
  console.error('usage: tsx measure-radix.ts <extracted radix package dir> <scale> [scale...]');
  process.exit(1);
}

const radix = createRequire(import.meta.url)(path.resolve(packageDir, 'index.js')) as Record<
  string,
  Record<string, string>
>;

const hueDelta = (a: number, b: number) => ((a - b + 540) % 360) - 180;
const round = (value: number) => Math.round(value * 10) / 10;

for (const name of names) {
  for (const variant of [name, `${name}Dark`]) {
    const scale = radix[variant];
    if (!scale) {
      console.error(`no scale "${variant}" in ${packageDir}`);
      continue;
    }
    const steps = Object.values(scale).map((hex) => Hct.fromInt(argbFromHex(hex)));
    const seedHue = steps[8].hue;
    const points = steps
      .filter((step) => step.chroma >= 3)
      .map((step) => [round(step.tone), round(hueDelta(step.hue, seedHue))]);
    console.log(
      `${variant.padEnd(14)} seed h${round(seedHue)} c${round(steps[8].chroma)} t${round(steps[8].tone)}`,
    );
    console.log(
      `  steps   ${steps.map((s, i) => `${i + 1}:${round(s.hue)}/${round(s.chroma)}/${round(s.tone)}`).join(' ')}`,
    );
    const offsets = steps.slice(0, 11).map((step) => round(hueDelta(step.hue, seedHue)));
    console.log(`  curve   ${JSON.stringify(points)}`);
    console.log(`  offsets ${JSON.stringify(offsets)}`);
  }
}
