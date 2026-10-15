import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const scopeActive = ':is([data-scope-active])';

export const styles = stylex.create({
  debugOutline: {
    outline: {
      default: 'none',
      [scopeActive]: `2px dashed color-mix(in srgb, ${cssVar.colorInfo} 60%, transparent)`,
    },
    outlineOffset: { default: null, [scopeActive]: -2 },
  },
  root: {
    outline: 'none',
    position: 'relative',
  },
});
