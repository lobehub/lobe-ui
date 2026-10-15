import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  clickableBorderless: {
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillTertiary },
    boxShadow: 'none',
  },
  clickableFilled: {
    backgroundColor: { 'default': cssVar.colorFillTertiary, ':hover': cssVar.colorFillSecondary },
  },
  clickableOutlined: {
    borderColor: { 'default': cssVar.colorBorderSecondary, ':hover': cssVar.colorBorder },
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgContainer,
  },
  clickableRoot: {
    cursor: 'pointer',
  },
  glass: {
    backdropFilter: 'saturate(150%) blur(10px)',
  },
  root: {
    borderRadius: cssVar.borderRadius,
    position: 'relative',
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});
