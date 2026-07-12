import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  colophon: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  `,

  dot: css`
    opacity: 0.55;
  `,

  external: css`
    &::after {
      content: '↗';
      margin-inline-start: 0.2em;
      font-size: 0.85em;
      opacity: 0.6;
    }
  `,

  root: css`
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;

    width: min(100% - 3rem, 64rem);
    margin-inline: auto;
    padding-block: 1.5rem;
    border-block-start: 1px solid var(--docs-border-subtle);

    font-size: 0.8125rem;
    color: var(--docs-text-subtle);

    nav {
      display: flex;
      gap: 1.25rem;
    }

    a {
      color: var(--docs-text-subtle);
      text-decoration: none;
      transition: color 140ms ease;

      &:hover,
      &:focus-visible {
        color: var(--docs-text-primary);
      }
    }

    @media (width <= 47.5rem) {
      flex-direction: column;
      gap: 0.75rem;
      width: min(100% - 2rem, 64rem);
    }
  `,
}));
