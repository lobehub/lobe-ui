import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  const dialog = css`
    position: relative;

    overflow: hidden;
    display: flex;
    flex-direction: column;

    width: min(100%, 38rem);
    max-height: min(37rem, calc(100dvh - 2rem));
    border: 1px solid var(--docs-border-default);
    border-radius: var(--docs-radius-lg);

    color: var(--docs-text-primary);

    background: color-mix(in srgb, var(--docs-surface-raised) 96%, transparent);
    box-shadow:
      0 24px 80px rgb(0 0 0 / 24%),
      var(--docs-shadow-control);

    @media (width <= 32rem) {
      width: 100%;
      min-height: 100dvh;
      max-height: 100dvh;
      border: 0;
      border-radius: 0;
    }
  `;

  const footer = css`
    display: flex;
    gap: 1rem;
    align-items: center;

    min-height: 2.5rem;
    padding-inline: 1rem;
    border-block-start: 1px solid var(--docs-border-subtle);

    font-size: 0.6875rem;
    color: var(--docs-text-subtle);

    background: var(--docs-surface-muted);

    span {
      display: inline-flex;
      gap: 0.25rem;
      align-items: center;
    }

    kbd {
      min-width: 1.25rem;
      padding-inline: 0.2rem;
      border: 1px solid var(--docs-border-default);
      border-radius: 0.25rem;

      font-family: var(--docs-font-mono);
      font-size: 0.625rem;
      line-height: 1.125rem;
      color: var(--docs-text-secondary);
      text-align: center;

      background: var(--docs-surface-raised);
    }

    @media (width <= 32rem) {
      margin-block-start: auto;
    }
  `;

  return {
    backdrop: css`
      position: absolute;
      inset: 0;

      width: 100%;
      height: 100%;
      padding: 0;
      border: 0;

      background: var(--docs-overlay);
      backdrop-filter: blur(3px);

      @media (prefers-reduced-motion: reduce) {
        backdrop-filter: none;
      }
    `,

    dialog,

    footer,

    inputRow: css`
      display: flex;
      gap: 0.75rem;
      align-items: center;

      min-height: 3.75rem;
      padding-inline: 1rem 0.75rem;
      border-block-end: 1px solid var(--docs-border-subtle);

      color: var(--docs-text-subtle);

      input {
        flex: 1;

        min-width: 0;
        height: 3.5rem;
        border: 0;

        font: inherit;
        font-size: 0.9375rem;
        color: var(--docs-text-primary);

        background: transparent;
        outline: 0;

        &::placeholder {
          color: var(--docs-text-subtle);
        }
      }

      button {
        cursor: pointer;

        display: inline-grid;
        place-items: center;

        width: 2.25rem;
        height: 2.25rem;
        padding: 0;
        border: 0;
        border-radius: var(--docs-radius-md);

        color: var(--docs-text-subtle);

        background: transparent;

        &:hover {
          color: var(--docs-text-primary);
          background: var(--docs-surface-hover);
        }
      }
    `,

    layer: css`
      position: fixed;
      z-index: 140;
      inset: 0;

      display: grid;
      place-items: start center;

      padding-block: min(14vh, 8rem) 1rem;
      padding-inline: 1rem;

      @media (width <= 32rem) {
        padding: 0;
      }
    `,

    result: css`
      cursor: pointer;

      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;

      width: 100%;
      padding: 0.75rem;
      border: 1px solid transparent;
      border-radius: var(--docs-radius-md);

      font: inherit;
      color: var(--docs-text-secondary);
      text-align: start;

      background: transparent;

      &[aria-selected='true'] {
        border-color: var(--docs-border-subtle);
        color: var(--docs-text-primary);
        background: var(--docs-surface-hover);
      }
    `,

    resultCopy: css`
      display: grid;
      gap: 0.2rem;
      min-width: 0;

      strong {
        font-size: 0.875rem;
        font-weight: 620;
      }

      small {
        font-size: 0.6875rem;
        font-weight: 540;
        color: var(--docs-text-subtle);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      > span {
        overflow: hidden;

        font-size: 0.75rem;
        color: var(--docs-text-subtle);
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,

    results: css`
      overflow: auto;
      min-height: 5rem;
      padding-block: 0.375rem 0.75rem;
      padding-inline: 0.5rem;
    `,

    resultsStatus: css`
      min-height: 1.75rem;
      padding-block: 0.625rem 0;
      padding-inline: 1rem;

      font-size: 0.75rem;
      color: var(--docs-text-subtle);
    `,
  };
});
