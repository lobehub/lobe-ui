import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  container: {
    '--lobe-markdown-header-multiple': '0.5',
    '--lobe-markdown-margin-multiple': 1,
    'marginBlock': 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
    'paddingInlineStart': '2.5em',
    'position': 'relative',
    '::before': {
      backgroundColor: cssVar.colorBorderSecondary,
      content: '""',
      display: 'block',
      insetBlockStart: '0.25em',
      insetInlineStart: '0.9em',
      position: 'absolute',
      height: 'calc(100% - 0.5em)',
      width: 1,
    },
  },
});
