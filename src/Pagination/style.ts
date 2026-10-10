import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const enabledHover = ':hover:not(:disabled)';
const currentAtRest = ':is([aria-current="page"]):is(:disabled, :not(:hover))';

export const styles = stylex.create({
  button: {
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 'medium',
    paddingInline: 6,
    transition: 'background-color 0.15s',
    alignItems: 'center',
    backgroundColor: {
      [currentAtRest]: cssVar.colorFillSecondary,
      default: 'transparent',
      [enabledHover]: cssVar.colorFillTertiary,
    },
    color: {
      'default': cssVar.colorTextSecondary,
      [enabledHover]: cssVar.colorText,
      ':disabled:not([aria-current="page"])': cssVar.colorTextQuaternary,
      ':is([aria-current="page"]):not(:hover:not(:disabled))': cssVar.colorText,
    },
    cursor: { 'default': 'pointer', ':disabled': 'default' },
    display: 'inline-flex',
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: { 'default': 500, ':is([aria-current="page"])': 600 },
    justifyContent: 'center',
    height: 28,
    minWidth: 28,
  },
  ellipsis: {
    alignItems: 'center',
    color: cssVar.colorTextQuaternary,
    display: 'inline-flex',
    justifyContent: 'center',
    letterSpacing: 2,
    width: 28,
  },
  root: {
    gap: 4,
    alignItems: 'center',
    display: 'inline-flex',
    fontVariantNumeric: 'tabular-nums',
  },
  small: {
    fontSize: 12,
    height: 24,
    minWidth: 24,
  },
  smallEllipsis: {
    width: 24,
  },
  total: {
    color: cssVar.colorTextTertiary,
    fontSize: 12,
    marginInlineEnd: 8,
    whiteSpace: 'nowrap',
  },
});
