import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  container: {
    '--lobe-markdown-margin-multiple': 1,
    'borderRadius': 'calc(var(--lobe-markdown-border-radius) * 1px)',
    'gap': '0.75em',
    'marginBlock': 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
    'overflow': 'hidden',
    'paddingBlock': 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
    'paddingInline': '1em',
  },
  content: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * -1em)',
  },
  inner: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
  },
});
