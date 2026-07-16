import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  emojiRow: css`
    display: flex;
    gap: 0.625rem;
    align-items: center;
  `,

  grid: css`
    display: grid;
    grid-auto-rows: minmax(7.5rem, auto);
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;

    margin-block-start: 1.75rem;

    @media (width <= 64rem) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (width <= 40rem) {
      grid-template-columns: 1fr;
    }
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

  tile: css`
    display: flex;
    flex-direction: column;

    min-width: 0;
    padding-block: 0.875rem 1rem;
    padding-inline: 1rem;
    border: 1px solid var(--docs-border-subtle);
    border-radius: 0.875rem;

    background: color-mix(in srgb, var(--docs-surface-raised) 62%, transparent);

    transition:
      border-color 140ms ease,
      transform 140ms ease,
      box-shadow 140ms ease;

    &:hover {
      transform: translateY(-2px);
      border-color: var(--docs-border-strong);
      box-shadow:
        0 1px 2px rgb(0 0 0 / 4%),
        0 8px 24px rgb(0 0 0 / 6%);
    }
  `,

  tileBody: css`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;

    min-width: 0;
    margin-block-start: 0.75rem;

    > * {
      max-width: 100%;
    }
  `,

  tileHeader: css`
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
    justify-content: space-between;

    a {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--docs-text-primary);
      text-decoration: none;

      &:hover {
        color: var(--docs-accent);
      }
    }

    span {
      overflow: hidden;

      font-size: 0.6875rem;
      color: var(--docs-text-subtle);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,

  tileLarge: css`
    grid-column: span 2;
    grid-row: span 2;

    @media (width <= 40rem) {
      grid-column: span 1;
      grid-row: span 1;
    }
  `,

  tileWide: css`
    grid-column: span 2;

    @media (width <= 40rem) {
      grid-column: span 1;
    }
  `,
}));
