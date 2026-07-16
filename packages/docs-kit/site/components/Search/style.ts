import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  const markReset = css`
    mark {
      font-weight: 680;
      color: inherit;
      background: transparent;
    }
  `;

  const dialog = css`
    position: relative;

    overflow: hidden;
    display: flex;
    flex-direction: column;

    width: min(100%, 44rem);
    height: min(37rem, calc(100dvh - 2rem));
    max-height: min(37rem, calc(100dvh - 2rem));
    border: 1px solid var(--docs-border-default);
    border-radius: var(--docs-radius-lg);

    color: var(--docs-text-primary);

    background: color-mix(in srgb, var(--docs-surface-raised) 92%, transparent);
    backdrop-filter: blur(20px);
    box-shadow:
      0 24px 80px rgb(0 0 0 / 24%),
      var(--docs-shadow-control);

    @media (width <= 32rem) {
      width: 100%;
      height: 100dvh;
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

    body: css`
      display: flex;
      flex: 1;
      min-height: 0;
    `,

    dialog,

    escHint: css`
      padding-block: 0.15rem;
      padding-inline: 0.4rem;
      border: 1px solid var(--docs-border-default);
      border-radius: 0.3rem;

      font-family: var(--docs-font-mono);
      font-size: 0.625rem;
      color: var(--docs-text-subtle);

      background: var(--docs-surface-raised);
    `,

    footer,

    group: css`
      &:not(:first-of-type) {
        margin-block-start: 0.5rem;
      }
    `,

    groupLabel: css`
      padding-block: 0.5rem 0.25rem;
      padding-inline: 0.6rem;

      font-size: 0.625rem;
      font-weight: 600;
      color: var(--docs-text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.09em;
    `,

    inputRow: css`
      display: flex;
      gap: 0.75rem;
      align-items: center;

      min-height: 3.5rem;
      padding-inline: 1rem 0.9rem;
      border-block-end: 1px solid var(--docs-border-subtle);

      color: var(--docs-text-subtle);

      input {
        flex: 1;

        min-width: 0;
        height: 3.25rem;
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

    listPane: css`
      display: flex;
      flex-basis: 55%;
      flex-direction: column;

      min-height: 0;
      border-inline-end: 1px solid var(--docs-border-subtle);

      @media (width <= 48rem) {
        flex-basis: auto;
        flex-grow: 1;
        border-inline-end: 0;
      }
    `,

    preview: css`
      ${markReset}
      overflow: auto;
      flex: 1;

      min-width: 0;
      padding-block: 1.1rem;
      padding-inline: 1.25rem;

      background: var(--docs-surface-muted);

      @media (width <= 48rem) {
        display: none;
      }
    `,

    previewAnchor: css`
      cursor: pointer;

      display: flex;
      gap: 0.35rem;
      align-items: center;

      width: 100%;
      padding-block: 0.35rem;
      padding-inline: 0.4rem;
      border: 0;
      border-radius: var(--docs-radius-sm);

      font: inherit;
      font-size: 0.8125rem;
      color: var(--docs-text-secondary);
      text-align: start;

      background: transparent;

      svg {
        flex: none;
        color: var(--docs-text-subtle);
      }

      &[data-active='true'] {
        color: var(--docs-text-primary);
        background: var(--docs-surface-hover);
      }
    `,

    previewAnchors: css`
      display: flex;
      flex-direction: column;
      gap: 0.1rem;

      margin-block-start: 1.1rem;
      padding-block-start: 0.9rem;
      border-block-start: 1px solid var(--docs-border-subtle);
    `,

    previewAnchorsLabel: css`
      padding-block-end: 0.35rem;
      padding-inline: 0.4rem;

      font-size: 0.625rem;
      font-weight: 600;
      color: var(--docs-text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.09em;
    `,

    previewCategory: css`
      font-size: 0.625rem;
      font-weight: 600;
      color: var(--docs-text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.09em;
    `,

    previewExcerpt: css`
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 6;

      margin-block-start: 0.5rem;

      font-size: 0.8125rem;
      line-height: 1.55;
      color: var(--docs-text-secondary);
    `,

    previewTitle: css`
      margin-block: 0.4rem 0;
      font-size: 0.9375rem;
      font-weight: 650;
      color: var(--docs-text-primary);
    `,

    result: css`
      cursor: pointer;

      display: flex;
      gap: 0.6rem;
      align-items: center;

      min-height: 2.25rem;
      padding-block: 0.3rem;
      padding-inline: 0.5rem 0.6rem;
      border: 1px solid transparent;
      border-radius: var(--docs-radius-md);

      color: var(--docs-text-secondary);

      ${markReset}

      &[aria-selected='true'] {
        border-color: var(--docs-border-subtle);
        color: var(--docs-text-primary);
        background: var(--docs-surface-hover);
      }

      [data-remove] {
        opacity: 0;
        transition: opacity 0.12s ease;
      }

      &:hover [data-remove],
      &[aria-selected='true'] [data-remove],
      [data-remove]:focus-visible {
        opacity: 1;
      }
    `,

    resultEnter: css`
      flex: none;
      color: var(--docs-text-subtle);
    `,

    resultExcerpt: css`
      color: var(--docs-text-subtle);
    `,

    resultIcon: css`
      display: grid;
      flex: none;
      place-items: center;

      width: 1.5rem;
      height: 1.5rem;
      border-radius: var(--docs-radius-sm);

      color: var(--docs-text-subtle);

      background: var(--docs-surface-muted);
    `,

    resultRemove: css`
      cursor: pointer;

      display: inline-grid;
      flex: none;
      place-items: center;

      width: 1.25rem;
      height: 1.25rem;
      padding: 0;
      border: 0;
      border-radius: var(--docs-radius-sm);

      color: var(--docs-text-subtle);

      background: transparent;

      &:hover {
        color: var(--docs-text-primary);
        background: var(--docs-surface-active);
      }
    `,

    resultTitle: css`
      overflow: hidden;
      flex: 1;

      min-width: 0;

      font-size: 0.8125rem;
      font-weight: 560;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,

    results: css`
      overflow: auto;
      flex: 1;

      min-height: 0;
      padding-block: 0.4rem 0.75rem;
      padding-inline: 0.5rem;
    `,

    resultsStatus: css`
      font-size: 0.75rem;
      color: var(--docs-text-subtle);

      &:not(:empty) {
        padding-block: 0.6rem 0.2rem;
        padding-inline: 1rem;
      }
    `,
  };
});
