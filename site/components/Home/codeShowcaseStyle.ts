import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  const tabBase = css`
    cursor: pointer;

    min-height: 2.5rem;
    padding-block: 0.375rem;
    padding-inline: 1rem;
    border: none;
    border-radius: 999px;

    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--docs-text-subtle);

    background: transparent;

    transition:
      color 140ms ease,
      background-color 140ms ease,
      transform 90ms ease;

    &:hover {
      color: var(--docs-text-primary);
    }

    &:active {
      transform: scale(0.96);
    }
  `;

  return {
    codePane: css`
      overflow: auto;

      min-width: 0;
      min-height: 18.75rem;
      padding-block: 1rem;
      padding-inline: 1.25rem;
      border: 1px solid var(--docs-border-subtle);
      border-radius: 0.875rem;

      background: var(--docs-code-background);
    `,

    panes: css`
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      margin-block-start: 1.25rem;

      @media (width <= 47.5rem) {
        grid-template-columns: 1fr;
      }
    `,

    previewPane: css`
      display: flex;
      align-items: center;
      justify-content: center;

      min-width: 0;
      min-height: 18.75rem;
      padding-block: 1.25rem;
      padding-inline: 1.25rem;
      border: 1px solid var(--docs-border-subtle);
      border-radius: 0.875rem;

      background: color-mix(in srgb, var(--docs-surface-raised) 62%, transparent);
    `,

    root: css`
      padding-block: clamp(3rem, 8vh, 5rem);
      border-block-start: 1px solid var(--docs-border-subtle);

      h2 {
        margin: 0;

        font-size: 1.5rem;
        font-weight: 650;
        color: var(--docs-text-primary);
        text-align: center;
        text-wrap: balance;
        letter-spacing: -0.02em;
      }

      > p {
        margin-block: 0.5rem 0;
        margin-inline: 0;

        font-size: 0.875rem;
        color: var(--docs-text-secondary);
        text-align: center;
        text-wrap: pretty;
      }
    `,

    tab: tabBase,

    tabActive: css`
      ${tabBase};
      color: var(--docs-text-primary);
      background: var(--docs-surface-active);
    `,

    tabs: css`
      display: flex;
      gap: 0.375rem;
      justify-content: center;
      margin-block-start: 1.25rem;
    `,

    themingRow: css`
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
      align-items: center;
    `,
  };
});
