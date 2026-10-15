import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  close: {
    insetBlockStart: 8,
    insetInlineEnd: 8,
    position: 'absolute',
  },
  content: {
    padding: 16,
  },
  cover: {
    alignSelf: 'center',
  },
  desc: {
    color: cssVar.colorTextDescription,
  },
  filledDark: {
    backgroundColor: 'transparent',
    backgroundImage: `linear-gradient(to bottom, ${cssVar.colorFillTertiary}, ${cssVar.colorFillQuaternary})`,
  },
  filledLight: {
    backgroundColor: 'transparent',
    backgroundImage: `linear-gradient(to bottom, ${cssVar.colorFillQuaternary}, ${cssVar.colorFillTertiary})`,
  },
  root: {
    borderRadius: cssVar.borderRadiusLG,
    overflow: 'hidden',
    position: 'relative',
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
