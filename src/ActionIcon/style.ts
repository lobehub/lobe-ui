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
      'default': `color-mix(in srgb, ${cssVar.colorError} 66%, transparent)`,
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
  sizeLarge: {
    borderRadius: 8,
    height: 44,
    width: 44,
  },
  sizeMiddle: {
    borderRadius: 6,
    height: 36,
    width: 36,
  },
  sizeSmall: {
    borderRadius: 4,
    height: 24,
    width: 24,
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});

export const actionIconStyles = {
  active: stylex.props(styles.active).className ?? '',
  activeFill: stylex.props(styles.activeFill).className ?? '',
  activeOutlined: stylex.props(styles.activeOutlined).className ?? '',
  dangerRoot: stylex.props(styles.dangerRoot).className ?? '',
  glass: stylex.props(styles.glass).className ?? '',
  root: stylex.props(styles.root).className ?? '',
  sizeLarge: stylex.props(styles.sizeLarge).className ?? '',
  sizeMiddle: stylex.props(styles.sizeMiddle).className ?? '',
  sizeSmall: stylex.props(styles.sizeSmall).className ?? '',
  shadow: stylex.props(styles.shadow).className ?? '',
} satisfies Record<keyof typeof styles, string>;
