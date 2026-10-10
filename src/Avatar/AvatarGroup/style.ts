import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  avatar: {
    borderColor: cssVar.colorBgContainer,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  count: {
    color: cssVar.colorBgLayout,
    fontSize: '0.8em',
  },
});
