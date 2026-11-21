import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  avatar: {
    borderColor: cssVar.colorBgContainer,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  root: {
    position: 'relative',
  },
  count: {
    color: cssVar.colorBgLayout,
    fontSize: '0.8em',
  },
  item: {
    flex: 'none',
    display: 'inline-flex',
    position: 'relative',
  },
  badge: {
    display: 'flex',
    insetInlineEnd: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translate(40%, 30%)',
    bottom: 0,
  },
});
