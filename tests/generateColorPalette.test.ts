import { describe, expect, it } from 'vitest';

import {
  generateColorNeutralPalette,
  generateColorPalette,
} from '../src/styles/theme/generateColorPalette';

const mockColorScale = {
  dark: [
    '#000000', // 0
    '#141414', // 1
    '#1f1f1f', // 2
    '#262626', // 3
    '#434343', // 4
    '#595959', // 5
    '#8c8c8c', // 6
    '#bfbfbf', // 7
    '#d9d9d9', // 8
    '#f0f0f0', // 9
    '#f5f5f5', // 10
    '#fafafa', // 11
    '#ffffff', // 12
  ] as [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ],
  darkA: [
    '#00000000', // 0
    '#ffffff1f', // 1
    '#ffffff33', // 2
    '#ffffff4d', // 3
    '#ffffff66', // 4
    '#ffffff80', // 5
    '#ffffff99', // 6
    '#ffffffb3', // 7
    '#ffffffcc', // 8
    '#ffffffe6', // 9
    '#ffffff', // 10
    '#ffffff', // 11
    '#ffffff', // 12
  ] as [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ],
  light: [
    '#ffffff', // 0
    '#fafafa', // 1
    '#f5f5f5', // 2
    '#f0f0f0', // 3
    '#d9d9d9', // 4
    '#bfbfbf', // 5
    '#8c8c8c', // 6
    '#595959', // 7
    '#434343', // 8
    '#262626', // 9
    '#1f1f1f', // 10
    '#141414', // 11
    '#000000', // 12
  ] as [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ],
  lightA: [
    '#00000000', // 0
    '#0000000a', // 1
    '#00000014', // 2
    '#0000001f', // 3
    '#00000029', // 4
    '#00000033', // 5
    '#0000004d', // 6
    '#00000066', // 7
    '#00000080', // 8
    '#00000099', // 9
    '#000000b3', // 10
    '#000000e6', // 11
    '#000000', // 12
  ] as [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ],
};

describe('generateColorPalette', () => {
  it('should generate color palette for light mode', () => {
    const palette = generateColorPalette({
      appearance: 'light',
      scale: mockColorScale,
      type: 'Primary',
    });

    expect(palette).toEqual({
      colorPrimary: mockColorScale.light[9],
      colorPrimaryActive: mockColorScale.light[10],
      colorPrimaryBg: mockColorScale.light[1],
      colorPrimaryBgHover: mockColorScale.light[2],
      colorPrimaryBorder: mockColorScale.light[4],
      colorPrimaryBorderHover: mockColorScale.light[3],
      colorPrimaryHover: mockColorScale.light[8],
      colorPrimaryText: mockColorScale.light[9],
      colorPrimaryTextActive: mockColorScale.light[10],
      colorPrimaryTextHover: mockColorScale.light[8],
    });
  });

  it('should generate color palette for dark mode', () => {
    const palette = generateColorPalette({
      appearance: 'dark',
      scale: mockColorScale,
      type: 'Primary',
    });

    expect(palette).toEqual({
      colorPrimary: mockColorScale.dark[9],
      colorPrimaryActive: mockColorScale.dark[7],
      colorPrimaryBg: mockColorScale.dark[1],
      colorPrimaryBgHover: mockColorScale.dark[2],
      colorPrimaryBorder: mockColorScale.dark[4],
      colorPrimaryBorderHover: mockColorScale.dark[5],
      colorPrimaryHover: mockColorScale.dark[10],
      colorPrimaryText: mockColorScale.dark[9],
      colorPrimaryTextActive: mockColorScale.dark[7],
      colorPrimaryTextHover: mockColorScale.dark[10],
    });
  });

  it('should handle different color types', () => {
    const palette = generateColorPalette({
      appearance: 'light',
      scale: mockColorScale,
      type: 'Error',
    });

    expect(palette).toHaveProperty('colorErrorBg');
    expect(palette).toHaveProperty('colorErrorText');
  });
});

describe('generateColorNeutralPalette', () => {
  it('should generate neutral palette for light mode', () => {
    const palette = generateColorNeutralPalette({
      appearance: 'light',
      scale: mockColorScale,
    });

    expect(palette).toEqual({
      colorBgContainer: mockColorScale.light[0],
      colorBgElevated: mockColorScale.light[0],
      colorBgLayout: mockColorScale.light[1],
      colorBgMask: mockColorScale.lightA[8],
      colorBgSpotlight: mockColorScale.light[4],
      colorBorder: mockColorScale.light[3],
      colorBorderSecondary: mockColorScale.light[2],
      colorFill: mockColorScale.lightA[3],
      colorFillQuaternary: mockColorScale.lightA[0],
      colorFillSecondary: mockColorScale.lightA[2],
      colorFillTertiary: mockColorScale.lightA[1],
      colorText: mockColorScale.light[12],
      colorTextQuaternary: mockColorScale.light[6],
      colorTextSecondary: mockColorScale.light[10],
      colorTextTertiary: mockColorScale.light[8],
    });
  });

  it('should generate neutral palette for dark mode', () => {
    const palette = generateColorNeutralPalette({
      appearance: 'dark',
      scale: mockColorScale,
    });

    expect(palette).toEqual({
      colorBgContainer: mockColorScale.dark[1],
      colorBgElevated: mockColorScale.dark[2],
      colorBgLayout: mockColorScale.dark[0],
      colorBgMask: mockColorScale.lightA[8],
      colorBgSpotlight: mockColorScale.dark[4],
      colorBorder: mockColorScale.dark[3],
      colorBorderSecondary: mockColorScale.dark[2],
      colorFill: mockColorScale.darkA[3],
      colorFillQuaternary: mockColorScale.darkA[0],
      colorFillSecondary: mockColorScale.darkA[2],
      colorFillTertiary: mockColorScale.darkA[1],
      colorText: mockColorScale.dark[12],
      colorTextQuaternary: mockColorScale.dark[6],
      colorTextSecondary: mockColorScale.dark[10],
      colorTextTertiary: mockColorScale.dark[8],
    });
  });
});
