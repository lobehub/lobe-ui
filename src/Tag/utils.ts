import { camelCase } from 'lodash-es';

export const presetColors = [
  'red',
  'volcano',
  'orange',
  'gold',
  'yellow',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'magenta',
  'gray',
];

export const presetSystemColors = new Set(['error', 'warning', 'success', 'info']);

export const colorsPreset = (theme: any, type: string, ...keys: string[]) =>
  theme[camelCase([type, ...keys].join('-'))] as string;

export const colorsPresetSystem = (theme: any, type: string, ...keys: string[]) =>
  theme[camelCase(['color', type, ...keys].join('-'))] as string;
