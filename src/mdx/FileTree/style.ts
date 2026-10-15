import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  container: {
    borderRadius: 'calc(var(--lobe-markdown-border-radius) * 1px)',
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
    paddingBlock: '0.75em',
    paddingInline: '1em',
    boxShadow: '0 0 0 1px var(--lobe-markdown-border-color)',
    color: cssVar.colorTextSecondary,
  },
  folder: {
    color: { 'default': null, ':hover': cssVar.colorText },
    cursor: 'pointer',
  },
});
