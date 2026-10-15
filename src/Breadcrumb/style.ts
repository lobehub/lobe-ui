import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  button: {
    font: 'inherit',
    padding: 0,
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    color: 'inherit',
    cursor: 'pointer',
  },
  item: {
    gap: 4,
    alignItems: 'center',
    color: {
      'default': cssVar.colorTextDescription,
      ":is([aria-current='page'])": cssVar.colorText,
    },
    display: 'flex',
    fontWeight: { 'default': null, ":is([aria-current='page'])": 500 },
  },
  link: {
    borderRadius: 4,
    textDecoration: 'none',
    color: 'inherit',
  },
  list: {
    margin: 0,
    padding: 0,
    gap: 4,
    listStyle: 'none',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    fontSize: 14,
    lineHeight: 1.5,
  },
  separator: {
    alignItems: 'center',
    color: cssVar.colorTextQuaternary,
    display: 'inline-flex',
  },
});
