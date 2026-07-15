import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  caption: css`
    padding-block: 0.5rem;
    padding-inline: 0.875rem;
    border-block-end: 1px solid var(--docs-border-subtle);

    font-size: 0.8125rem;
    font-weight: 640;
    color: var(--docs-text-primary);
    letter-spacing: -0.015em;

    @media (width <= 47.5rem) {
      padding-inline: 0.75rem;
    }
  `,

  card: css`
    overflow: hidden;

    border: 1px solid var(--docs-border-default);
    border-radius: var(--docs-radius-lg);

    background: var(--docs-surface-raised);
    box-shadow: var(--docs-shadow-inset);

    && p {
      max-width: none;
      margin-block: 0;
      margin-inline: 0;
    }
  `,

  componentDetails: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    align-items: baseline;

    margin-block: -0.25rem 1rem;
    margin-inline: 0;
  `,

  definition: css`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    min-width: 0;
    margin: 0;
  `,

  description: css`
    && {
      max-width: 68ch;
      margin-block: 0 1rem;
      margin-inline: 0;

      line-height: 1.7;
      color: var(--docs-text-secondary);
      text-wrap: pretty;
    }
  `,

  detailDeprecated: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem 0.5rem;
    align-items: baseline;

    font-size: 0.8125rem;
    color: var(--docs-text-secondary);
  `,

  empty: css`
    margin: 0;
    padding-block: 0.75rem;
    padding-inline: 0.875rem;

    font-size: 0.8125rem;
    color: var(--docs-text-subtle);
    text-align: center;

    @media (width <= 47.5rem) {
      padding-inline: 0.75rem;
    }
  `,

  flag: css`
    font-size: 0.625rem;
    font-weight: 650;
    color: var(--docs-accent);
    text-transform: uppercase;
    letter-spacing: 0.045em;
  `,

  flagDeprecated: css`
    font-size: 0.625rem;
    font-weight: 650;
    color: var(--docs-danger-text, #b42318);
    text-transform: uppercase;
    letter-spacing: 0.045em;
  `,

  footnote: css`
    max-width: none;
    margin: 0;
    padding-block: 0.375rem;
    padding-inline: 0.875rem;
    border-block-start: 1px solid var(--docs-border-subtle);

    font-size: 0.75rem;
    color: var(--docs-text-subtle);

    background: color-mix(in srgb, var(--docs-surface-muted) 55%, transparent);

    @media (width <= 47.5rem) {
      padding-inline: 0.75rem;
    }
  `,

  list: css`
    margin: 0;
  `,

  origin: css`
    font-size: 0.7188rem;
    color: var(--docs-text-subtle);
  `,

  propertyName: css`
    padding-block: 0.125rem;
    padding-inline: 0.375rem;
    border: 1px solid var(--docs-border-subtle);
    border-radius: var(--docs-radius-sm);

    font-family: var(--docs-font-mono);
    font-size: 0.75rem;
    color: var(--docs-text-primary);
    overflow-wrap: anywhere;

    background: var(--docs-surface-muted);
  `,

  prose: css`
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--docs-text-secondary);

    code {
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
      color: var(--docs-text-primary);
    }
  `,

  proseDefault: css`
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--docs-text-subtle);

    code {
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
      color: var(--docs-text-primary);
    }
  `,

  root: css`
    margin-block: 0.75rem 2rem;
    color: var(--docs-text-secondary);

    @media (width <= 47.5rem) {
      margin-block: 0.5rem 1.5rem;
    }
  `,

  row: css`
    display: grid;
    grid-template-columns: minmax(8rem, 10rem) minmax(0, 1fr);
    gap: 0.75rem 1rem;

    padding-block: 0.5rem;
    padding-inline: 0.875rem;

    & + & {
      border-block-start: 1px solid var(--docs-border-subtle);
    }

    &:hover {
      background: var(--docs-surface-hover);
    }

    @media (width <= 47.5rem) {
      grid-template-columns: 1fr;
      gap: 0.375rem;
      padding-inline: 0.75rem;
    }
  `,

  term: css`
    display: flex;
    flex-direction: column;
    gap: 0.1875rem;
    align-items: flex-start;

    min-width: 0;

    @media (width <= 47.5rem) {
      flex-flow: row wrap;
      gap: 0.25rem 0.5rem;
      align-items: baseline;
    }
  `,

  type: css`
    align-self: flex-start;

    padding: 0;
    border: 0;

    font-family: var(--docs-font-mono);
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--docs-accent);
    overflow-wrap: break-word;

    background: transparent;
  `,
}));
