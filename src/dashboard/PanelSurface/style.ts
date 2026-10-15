import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  body: {
    '--surface-pad-block': '16px',
    '--surface-pad-inline': '16px',
    'padding': 16,
  },
  bodySmall: {
    '--surface-pad-block': '12px',
    '--surface-pad-inline': '16px',
    'paddingBlock': 12,
    'paddingInline': 16,
  },
  loadingBody: {
    paddingBlockEnd: 8,
    paddingBlockStart: 4,
  },
});
