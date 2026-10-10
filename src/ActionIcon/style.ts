import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const hover = ':hover:not(:active)';
const pressed = ':active:not(:disabled, [aria-disabled="true"])';

export const styles = stylex.create({
  active: {
    backgroundColor: cssVar.colorFillSecondary,
  },
  activeFill: {
    backgroundColor: { default: cssVar.colorFillSecondary, [pressed]: cssVar.colorFill },
  },
  activeOutlined: {
    backgroundColor: { 'default': cssVar.colorFillSecondary, ':hover': cssVar.colorFill },
  },
  dangerRoot: {
    color: {
      'default': cssVar.colorTextTertiary,
      [hover]: cssVar.colorError,
      ':active': cssVar.colorErrorActive,
    },
  },
  glass: {
    backdropFilter: 'saturate(150%) blur(10px)',
  },
  root: {
    color: {
      'default': cssVar.colorTextTertiary,
      [hover]: cssVar.colorTextSecondary,
      ':active': cssVar.colorText,
    },
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});

export const actionIconStyles = Object.fromEntries(
  Object.entries(styles).map(([key, value]) => [key, stylex.props(value).className ?? '']),
) as Record<keyof typeof styles, string>;
