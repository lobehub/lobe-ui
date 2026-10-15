import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const checked = ':is([data-checked], [data-indeterminate]):not([data-disabled])';
const hover = ':hover:not([data-disabled], [data-checked], [data-indeterminate])';
const disabled = ':is([data-disabled])';

export const styles = stylex.create({
  indicator: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  label: {
    alignItems: 'center',
    cursor: { 'default': 'pointer', ':has([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    userSelect: 'none',
  },
  root: {
    margin: 0,
    padding: 0,
    borderColor: {
      [checked]: `var(--lobe-checkbox-bg, ${cssVar.colorPrimary})`,
      default: cssVar.colorBorderSecondary,
      [disabled]: cssVar.colorFill,
      [hover]: cssVar.colorBorder,
    },
    borderStyle: 'solid',
    borderWidth: 1,
    flex: 'none',
    outline: 'none',
    transition: `background 150ms ${cssVar.motionEaseOut}, border-color 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: {
      [checked]: `var(--lobe-checkbox-bg, ${cssVar.colorPrimary})`,
      default: cssVar.colorBgContainer,
      [disabled]: cssVar.colorFill,
    },
    color: { default: cssVar.colorBgLayout, [disabled]: cssVar.colorText },
    cursor: { default: 'pointer', [disabled]: 'not-allowed' },
    display: 'inline-flex',
    justifyContent: 'center',
    opacity: { default: null, [disabled]: 0.25 },
  },
});

export const checkboxStyles = Object.fromEntries(
  Object.entries(styles).map(([key, value]) => [key, stylex.props(value).className ?? '']),
) as Record<keyof typeof styles, string>;
