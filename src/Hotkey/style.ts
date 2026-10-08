import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  borderless: {
    paddingInline: 4,
  },
  inverseThemeDark: {
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 8%, transparent)`,
    color: cssVar.colorTextTertiary,
  },
  inverseThemeLight: {
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgContainer} 16%, transparent)`,
    color: cssVar.colorTextTertiary,
  },
  root: {
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadiusSM,
    borderStyle: 'none',
    borderWidth: 'medium',
    overflow: 'hidden',
    paddingBlock: 0,
    paddingInline: 8,
    color: cssVar.colorTextSecondary,
    fontFamily: cssVar.fontFamily,
    fontSize: 12,
    lineHeight: 1.1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    height: '1.8em',
    minWidth: '1.8em',
  },
});
