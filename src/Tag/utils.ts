import { cssVar } from 'antd-style';
import { camelCase } from 'es-toolkit/compat';

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

export const presetSystemColors = new Set(['error', 'warning', 'success', 'info', 'processing']);

const toKebabCase = (value: string) =>
  value
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/([a-z])(\d)/g, '$1-$2')
    .replaceAll(/(\d)([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const getCssVar = (tokenKey: string) => {
  const mapped = (cssVar as Record<string, string>)[tokenKey];
  return mapped || `var(--ant-${toKebabCase(tokenKey)})`;
};

export const colorsPreset = (type: string, ...keys: string[]) =>
  getCssVar(camelCase([type, ...keys].join('-')));

export const colorsPresetSystem = (type: string, ...keys: string[]) => {
  const t = type === 'processing' ? 'info' : type;
  return getCssVar(camelCase(['color', t, ...keys].join('-')));
};
