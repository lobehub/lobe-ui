import './style.css';

import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  picker: {
    paddingBlockStart: 0,
    position: 'relative',
    minWidth: 310,
  },
  pickerWithTabs: {
    paddingBlockStart: 4,
  },
  relative: {
    position: 'relative',
  },
  tabs: {
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
  },
});
