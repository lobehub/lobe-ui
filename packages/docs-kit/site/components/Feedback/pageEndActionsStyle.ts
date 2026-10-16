import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  divider: {
    marginInline: '0.2rem',
    backgroundColor: 'var(--docs-border-subtle)',
    height: '1rem',
    width: 1,
  },
  error: {
    gap: '0.75rem',
    alignItems: 'center',
    color: 'var(--docs-text-secondary)',
    display: 'flex',
    fontSize: '0.8125rem',
    marginBlockStart: '0.85rem',
  },
  hint: {
    color: 'var(--docs-text-subtle)',
    fontSize: '0.75rem',
    marginInlineEnd: '0.25rem',
  },
  panel: {
    marginBlockStart: '0.85rem',
  },
  retry: {
    font: 'inherit',
    borderColor: 'var(--docs-border-default)',
    borderRadius: '0.45rem',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingInline: '0.65rem',
    backgroundColor: 'var(--docs-surface-raised)',
    color: 'var(--docs-text-primary)',
    cursor: 'pointer',
    minHeight: '1.85rem',
  },
  root: {
    borderBlockStartColor: 'var(--docs-border-subtle)',
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    marginBlockStart: '2.25rem',
    paddingBlockStart: '1rem',
  },
  status: {
    color: 'var(--docs-text-subtle)',
    fontSize: '0.75rem',
    marginInlineEnd: '0.25rem',
  },
  statusLine: {
    marginInline: 0,
    color: 'var(--docs-text-secondary)',
    fontSize: '0.8125rem',
    marginBlockEnd: 0,
    marginBlockStart: '0.85rem',
  },
  toolbar: {
    gap: '0.125rem',
    alignItems: 'center',
    display: 'flex',
  },
});
