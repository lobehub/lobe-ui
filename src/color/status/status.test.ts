import { readFileSync } from 'node:fs';

import { argbFromHex, Hct } from '@material/material-color-utilities';

import {
  neutralTextPath,
  renderNeutralText,
  renderStatusScale,
  statusNames,
  statusScalePath,
} from '../../../scripts/generateColorTokens';
import { statusColorScales } from '.';

const hct = (hex: string) => Hct.fromInt(argbFromHex(hex));

describe('status color scales', () => {
  it.each(statusNames)('%s matches the generator output', (status) => {
    expect(readFileSync(statusScalePath(status), 'utf8')).toBe(renderStatusScale(status));
  });

  it('neutral text matches the generator output', () => {
    expect(readFileSync(neutralTextPath, 'utf8')).toBe(renderNeutralText());
  });

  it.each(statusNames)('%s tones are monotonic over steps 1–11', (status) => {
    const { dark, light } = statusColorScales[status];
    const lightTones = light.slice(1, 12).map((hex) => hct(hex).tone);
    const darkTones = dark.slice(1, 12).map((hex) => hct(hex).tone);
    lightTones.slice(1).forEach((tone, i) => expect(tone).toBeLessThan(lightTones[i]));
    darkTones.slice(1).forEach((tone, i) => expect(tone).toBeGreaterThan(darkTones[i]));
  });

  it('error never drifts into pink', () => {
    const { dark, light } = statusColorScales.error;
    for (const hex of [...light.slice(1, 12), ...dark.slice(1, 12)]) {
      const { chroma, hue } = hct(hex);
      if (chroma >= 3) expect(hue).toBeGreaterThanOrEqual(15);
    }
  });
});
