import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  circle: {
    borderRadius: '50%',
  },
  image: {
    display: 'block',
    objectFit: 'contain',
    height: '100%',
    width: '100%',
  },
  root: {
    overflow: 'hidden',
    alignItems: 'center',
    color: cssVar.colorTextTertiary,
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    verticalAlign: 'middle',
  },
  square: {
    borderRadius: 'calc(var(--lobe-favicon-size, 16px) / 4)',
  },
});
