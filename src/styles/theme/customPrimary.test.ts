import chroma from 'chroma-js';

import { colorScales } from '@/color/colors';

import { primaryColors } from '../customTheme';
import { createLobeToken } from './createLobeToken';
import { generatePrimaryScale, isCustomPrimaryColor } from './customPrimary';
import { getCustomPrimaryCss } from './themeCss';

const lightnessOf = (color: string) => chroma(color).oklch()[0];
const hueOf = (color: string) => chroma(color).oklch()[2];

describe('custom primary colour', () => {
  test('only 6-digit hex counts as custom', () => {
    expect(isCustomPrimaryColor('#7c5cff')).toBe(true);
    expect(isCustomPrimaryColor('#7C5CFF')).toBe(true);
    expect(isCustomPrimaryColor('blue')).toBe(false);
    expect(isCustomPrimaryColor('#fff')).toBe(false);
    expect(isCustomPrimaryColor(undefined)).toBe(false);
  });

  test('the picked colour is the solid step in both appearances', () => {
    const scale = generatePrimaryScale('#7C5CFF');

    expect(scale.light[9]).toBe('#7c5cff');
    expect(scale.dark[9]).toBe('#7c5cff');
    for (const steps of Object.values(scale)) expect(steps).toHaveLength(13);
  });

  test('backgrounds keep the nearest preset lightness and take the picked hue', () => {
    const scale = generatePrimaryScale('#7c5cff');

    for (const i of [0, 1, 2, 3])
      expect(lightnessOf(scale.light[i])).toBeCloseTo(
        lightnessOf(colorScales.geekblue.light[i]),
        1,
      );
    for (const i of [3, 4, 5])
      expect(Math.abs(hueOf(scale.light[i]) - hueOf('#7c5cff'))).toBeLessThan(12);
  });

  test('alpha steps keep the preset alpha', () => {
    const scale = generatePrimaryScale('#7c5cff');

    scale.lightA.forEach((step, i) => {
      expect(chroma(step).alpha()).toBeCloseTo(chroma(colorScales.geekblue.lightA[i]).alpha(), 2);
    });
  });

  test('a preset hex reproduces its own dark scale', () => {
    const scale = generatePrimaryScale(primaryColors.blue as `#${string}`);

    scale.dark.forEach((step, i) => {
      expect(chroma.deltaE(step, colorScales.blue.dark[i])).toBeLessThan(3);
    });
  });

  test('greys produce valid colours', () => {
    const scale = generatePrimaryScale('#808080');

    for (const steps of Object.values(scale))
      for (const step of steps) expect(chroma.valid(step)).toBe(true);
  });

  test('tokens and css follow the custom colour', () => {
    expect(createLobeToken({ appearance: 'light', primaryColor: '#7c5cff' }).colorPrimary).toBe(
      '#7c5cff',
    );

    const css = getCustomPrimaryCss('#7C5CFF');
    expect(css).toContain(`[data-primary-color='#7c5cff']:not([data-theme='dark'])`);
    expect(css).toContain(`[data-primary-color='#7c5cff'][data-theme='dark']`);
    expect(css).toContain('--lobe-color-primary: #7c5cff;');
  });
});
