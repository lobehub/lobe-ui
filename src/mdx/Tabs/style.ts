import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  body: {
    paddingInline: '1em',
  },
  inner: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
  },
});
