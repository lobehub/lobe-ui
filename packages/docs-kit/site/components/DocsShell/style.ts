import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  const iconButton = css`
    cursor: pointer;

    display: inline-grid;
    place-items: center;

    width: 2rem;
    min-width: 2rem;
    height: 2rem;
    padding: 0;
    border: 0;
    border-radius: var(--docs-radius-md);

    color: var(--docs-text-subtle);

    background: transparent;

    transition:
      color 140ms ease,
      background-color 140ms ease,
      transform 90ms ease;

    &:hover {
      color: var(--docs-text-primary);
      background: var(--docs-surface-hover);
    }

    &:active {
      transform: scale(0.96);
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `;

  return {
    actionLink: css`
      display: inline-flex;
      align-items: center;

      padding-inline: 0.5rem;

      font-size: 0.8438rem;
      font-weight: 480;
      color: var(--docs-text-subtle);
      text-decoration: none;
      white-space: nowrap;

      transition: color 140ms ease;

      &:hover {
        color: var(--docs-text-primary);
      }

      @media (width <= 47.5rem) {
        display: none;
      }
    `,

    iconButton,

    search: css`
      cursor: pointer;

      display: flex;
      gap: 0.5rem;
      align-items: center;

      width: 15rem;
      min-height: 2rem;
      padding-block: 0;
      padding-inline: 0.625rem 0.5rem;
      border: 1px solid var(--docs-border-default);
      border-radius: var(--docs-radius-md);

      font: inherit;
      color: var(--docs-text-subtle);

      background: var(--docs-surface-raised);

      transition:
        border-color 140ms ease,
        color 140ms ease,
        background-color 140ms ease;

      &:hover {
        border-color: var(--docs-border-strong);
        color: var(--docs-text-primary);
        background: var(--docs-surface-hover);
      }

      span {
        font-size: 0.8125rem;
      }

      @media (width <= 64rem) {
        justify-content: center;

        width: 2rem;
        min-width: 2rem;
        padding: 0;
        border: 0;

        background: transparent;

        span {
          display: none;
        }

        &:hover {
          background: var(--docs-surface-hover);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        transition-duration: 0.01ms;
      }
    `,

    searchHotkey: css`
      margin-inline-start: auto;

      @media (width <= 64rem) {
        display: none;
      }
    `,

    shell: css`
      height: 100dvh;

      > div > main {
        scroll-padding-top: 1.5rem;
        gap: 0;
        padding: 0;

        @media (width <= 80rem) {
          scroll-padding-top: 4rem;
        }
      }
    `,
  };
});
