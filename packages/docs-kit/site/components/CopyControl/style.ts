import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  root: css`
    cursor: pointer;

    display: inline-grid;
    flex: none;
    place-items: center;

    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: 0;
    border-radius: var(--docs-radius-sm);

    color: var(--docs-text-subtle);

    background: transparent;

    transition:
      color 140ms ease,
      background-color 140ms ease;

    &:hover {
      color: var(--docs-text-primary);
      background: var(--docs-surface-hover);
    }

    &[data-copied] {
      color: var(--docs-accent);
    }
  `,
}));
