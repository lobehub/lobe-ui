import * as stylex from '@stylexjs/stylex';

import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  actions: {
    flex: 'none',
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    inlineSize: { default: null, [media.mobile]: '100%' },
  },
  root: {
    gap: 16,
    alignItems: { default: 'flex-start', [media.mobile]: 'stretch' },
    display: 'flex',
    flexDirection: { default: null, [media.mobile]: 'column' },
    inlineSize: '100%',
    justifyContent: 'space-between',
    minInlineSize: 0,
  },
});
