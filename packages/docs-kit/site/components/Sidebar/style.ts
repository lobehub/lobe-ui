import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  activePill: css`
    position: absolute;
    inset: 0;
    border-radius: var(--docs-radius-md);
    background: var(--docs-surface-active);
  `,

  category: css`
    & + & {
      margin-block-start: 1.5rem;
    }

    h3 {
      margin-block: 0 0.375rem;
      margin-inline: 0.75rem 0;

      font-size: 0.6875rem;
      font-weight: 620;
      line-height: 1.25rem;
      color: var(--docs-text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
  `,

  label: css`
    position: relative;
  `,

  root: css`
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    padding-block: 0.25rem 2rem;
  `,

  section: css`
    h2 {
      margin-block: 0 0.5rem;
      margin-inline: 0.75rem 0;

      font-size: 0.6875rem;
      font-weight: 650;
      line-height: 1.25rem;
      color: var(--docs-text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.09em;
    }

    ul {
      display: grid;
      gap: 0.125rem;

      margin: 0;
      padding: 0;

      list-style: none;
    }

    a {
      position: relative;

      display: flex;
      align-items: center;

      min-height: 2rem;
      padding-block: 0.3125rem;
      padding-inline: 0.75rem;
      border-radius: var(--docs-radius-md);

      font-size: 0.8438rem;
      font-weight: 480;
      line-height: 1.25rem;
      color: var(--docs-text-secondary);
      text-decoration: none;

      transition: color 140ms ease;

      &:hover {
        color: var(--docs-text-primary);
      }

      &:hover:not([aria-current='page']) {
        background: var(--docs-surface-hover);
      }

      &[aria-current='page'] {
        font-weight: 590;
        color: var(--docs-text-primary);
      }

      @media (prefers-reduced-motion: reduce) {
        transition-duration: 0.01ms;
      }
    }
  `,
}));
