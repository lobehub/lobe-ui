import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  dashed: {
    'borderStyle': 'dashed',
    'borderBlockStartStyle': 'dashed',
    'borderInlineStartStyle': 'dashed',
    '::after': {
      borderBlockStartStyle: 'dashed',
    },
    '::before': {
      borderBlockStartStyle: 'dashed',
    },
  },
  horizontal: {
    margin: 0,
    borderStyle: 'none',
    borderWidth: 0,
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    flexShrink: 0,
    height: 0,
    width: '100%',
  },
  text: {
    flex: 'none',
    color: cssVar.colorTextDescription,
    fontSize: 12,
    lineHeight: 1.5,
  },
  vertical: {
    margin: 0,
    borderStyle: 'none',
    borderWidth: 0,
    alignSelf: 'center',
    borderInlineStartColor: cssVar.colorBorderSecondary,
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
    height: '1em',
    width: 0,
  },
  withText: {
    'margin': 0,
    'gap': 12,
    'alignItems': 'center',
    'display': 'flex',
    'width': '100%',
    '::after': {
      flex: '1',
      borderBlockStartColor: cssVar.colorBorderSecondary,
      borderBlockStartStyle: 'solid',
      borderBlockStartWidth: 1,
      content: "''",
    },
    '::before': {
      flex: '1',
      borderBlockStartColor: cssVar.colorBorderSecondary,
      borderBlockStartStyle: 'solid',
      borderBlockStartWidth: 1,
      content: "''",
    },
  },
});
