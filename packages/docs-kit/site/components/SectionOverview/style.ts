import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  root: css`
    display: flex;
    flex-direction: column;
    gap: 2.5rem;

    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 72rem;
    margin-inline: auto;
    padding-block: clamp(2rem, 5vw, 3.5rem) 4rem;
    padding-inline: clamp(1rem, 4vw, 2.5rem);
  `,

  header: css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h1 {
      margin: 0;

      font-size: clamp(1.75rem, 3vw, 2.25rem);
      font-weight: 650;
      line-height: 1.2;
      color: var(--docs-text-primary);
      letter-spacing: -0.02em;
    }

    p {
      margin: 0;
      font-size: 0.9375rem;
      color: var(--docs-text-secondary);
    }
  `,

  group: css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,

  groupTitle: css`
    display: flex;
    gap: 0.5rem;
    align-items: baseline;

    margin: 0;

    font-size: 1.125rem;
    font-weight: 600;

    a {
      color: var(--docs-text-primary);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        text-underline-offset: 0.2em;
      }
    }
  `,

  count: css`
    font-size: 0.8125rem;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
    color: var(--docs-text-subtle);
  `,

  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 0.75rem;

    margin: 0;
    padding: 0;

    list-style: none;
  `,

  card: css`
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    box-sizing: border-box;
    block-size: 100%;
    padding: 1rem;
    border: 1px solid var(--docs-border-default);
    border-radius: var(--docs-radius-md);

    color: inherit;
    text-decoration: none;

    background: var(--docs-surface-raised);

    transition:
      border-color 140ms ease,
      background-color 140ms ease;

    &:hover {
      border-color: var(--docs-border-strong);
      background: var(--docs-surface-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }
  `,

  cardTitle: css`
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--docs-text-primary);
  `,

  cardDescription: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--docs-text-secondary);
  `,
}));
