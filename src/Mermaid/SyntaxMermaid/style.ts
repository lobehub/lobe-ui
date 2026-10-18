import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  diagram: {
    position: 'relative',
    minWidth: 300,
    width: '100%',
  },
  fallbackCode: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowX: 'auto',
  },
  status: {
    padding: 16,
  },
  zoomIn: {
    cursor: 'zoom-in',
  },
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
