import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  padded: {
    padding: 16,
  },
  root: {
    margin: 0,
    padding: 0,
    direction: 'ltr',
    textAlign: 'start',
  },
  unmermaid: {
    color: cssVar.colorTextDescription,
  },
});
