import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  container: {
    '--lobe-markdown-margin-multiple': 1,
    'borderRadius': 'calc(var(--lobe-markdown-border-radius) * 1px)',
    'marginBlock': 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
    'overflow': 'hidden',
  },
  content: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * -1em)',
  },
  inner: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
  },
});
