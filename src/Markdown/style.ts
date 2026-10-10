import './style.css';

import * as stylex from '@stylexjs/stylex';

export const styles = {
  chat: 'lobe-markdown-chat',
  gfm: 'lobe-markdown-gfm',
  latex: 'lobe-markdown-latex',
};

export const rootStyles = stylex.create({
  root: {
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '100%',
  },
});
