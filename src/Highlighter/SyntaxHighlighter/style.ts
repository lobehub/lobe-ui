import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  root: {
    margin: 0,
    padding: 0,
    direction: 'ltr',
    textAlign: 'start',
  },
  unshiki: {
    color: cssVar.colorTextDescription,
  },
});
