import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  divider: css`
    width: 1px;
    height: 1rem;
    margin-inline: 0.2rem;
    background: var(--docs-border-subtle);
  `,

  error: css`
    display: flex;
    gap: 0.75rem;
    align-items: center;

    margin-block-start: 0.85rem;

    font-size: 0.8125rem;
    color: var(--docs-text-secondary);

    button {
      cursor: pointer;

      min-height: 1.85rem;
      padding-inline: 0.65rem;
      border: 1px solid var(--docs-border-default);
      border-radius: 0.45rem;

      font: inherit;
      color: var(--docs-text-primary);

      background: var(--docs-surface-raised);
    }
  `,

  hint: css`
    margin-inline-end: 0.25rem;
    font-size: 0.75rem;
    color: var(--docs-text-subtle);
  `,

  panel: css`
    margin-block-start: 0.85rem;
  `,

  root: css`
    margin-block-start: 2.25rem;
    padding-block-start: 1rem;
    border-block-start: 1px solid var(--docs-border-subtle);
  `,

  status: css`
    margin-inline-end: 0.25rem;
    font-size: 0.75rem;
    color: var(--docs-text-subtle);
  `,

  statusLine: css`
    margin-block: 0.85rem 0;
    margin-inline: 0;
    font-size: 0.8125rem;
    color: var(--docs-text-secondary);
  `,

  toolbar: css`
    display: flex;
    gap: 0.125rem;
    align-items: center;
  `,
}));
