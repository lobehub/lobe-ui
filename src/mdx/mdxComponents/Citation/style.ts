import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  container: {
    display: 'inline-flex',
    lineHeight: 'var(--lobe-markdown-line-height)',
    verticalAlign: 'baseline',
  },
  link: {
    color: cssVar.colorTextSecondary,
    cursor: 'pointer',
  },
  supContainer: {
    verticalAlign: 'super',
  },
  url: {
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    display: '-webkit-box',
    textOverflow: 'ellipsis',
    maxWidth: 400,
  },
});
