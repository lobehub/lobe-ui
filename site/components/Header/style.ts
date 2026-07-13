import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  const sheetBackdrop = css`
    cursor: default;

    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;

    opacity: 1;
    background: var(--docs-overlay);

    transition: opacity 180ms ease;

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `;

  const sheet = css`
    position: absolute;
    inset-block: 0;
    inset-inline: 0 auto;
    transform: translateX(0);

    overflow: auto;

    width: min(21rem, calc(100vw - 3rem));
    padding-block: 0 2rem;
    padding-inline: 1rem;
    border: 0;
    border-inline-end: 1px solid var(--docs-border-default);

    color: var(--docs-text-primary);

    background: var(--docs-background);
    box-shadow: var(--docs-shadow-sheet);

    transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `;

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

  const search = css`
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

    kbd {
      margin-inline-start: auto;
      padding-block: 0.0625rem;
      padding-inline: 0.3125rem;
      border: 1px solid var(--docs-border-subtle);
      border-radius: var(--docs-radius-sm);

      font-family: var(--docs-font-mono);
      font-size: 0.625rem;
      line-height: 1rem;
      color: var(--docs-text-subtle);

      background: var(--docs-surface-muted);
    }

    @media (width <= 64rem) {
      justify-content: center;

      width: 2rem;
      min-width: 2rem;
      padding: 0;
      border: 0;

      background: transparent;

      span,
      kbd {
        display: none;
      }

      &:hover {
        background: var(--docs-surface-hover);
      }
    }

    @media (width <= 47.5rem) {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `;

  const navLink = css`
    cursor: pointer;

    position: relative;

    display: inline-flex;
    align-items: center;
    align-self: stretch;

    padding-block: 0;
    padding-inline: 0.75rem;
    border: 0;

    font-size: 0.8438rem;
    font-weight: 480;
    color: var(--docs-text-subtle);
    text-decoration: none;
    white-space: nowrap;

    background: transparent;

    transition: color 140ms ease;

    &:hover {
      color: var(--docs-text-primary);
    }

    &[aria-current] {
      font-weight: 560;
      color: var(--docs-text-primary);
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `;

  return {
    actions: css`
      display: flex;
      flex: 1;
      gap: 0.375rem;
      align-items: center;
      justify-content: flex-end;

      @media (width <= 47.5rem) {
        flex: 1;
      }
    `,

    brand: css`
      display: inline-flex;
      flex: none;
      gap: 0.5rem;
      align-items: center;

      min-height: 2.25rem;

      color: var(--docs-text-primary);
      text-decoration: none;
    `,

    brandDivider: css`
      font-size: 1.125rem;
      font-weight: 300;
      line-height: 1;
      color: var(--docs-border-strong);
    `,

    github: css`
      @media (width <= 47.5rem) {
        display: none;
      }
    `,

    iconButton,

    inner: css`
      display: flex;
      gap: 1.25rem;
      align-items: center;

      width: min(100% - 2rem, var(--docs-shell-max-width));
      height: 100%;
      margin-inline: auto;

      @media (width <= 47.5rem) {
        gap: 0.5rem;
        width: min(100% - 1rem, var(--docs-shell-max-width));
      }
    `,

    logo: css`
      display: block;
      flex: none;
      width: 1.25rem;
      height: 1.25rem;
    `,

    menuButton: css`
      display: none;

      @media (width <= 47.5rem) {
        display: inline-grid;
      }
    `,

    mobileSearch: css`
      display: none;

      @media (width <= 47.5rem) {
        display: inline-grid;
      }
    `,

    moreButton: css`
      padding-block: 0;
      padding-inline: 0.625rem;
    `,

    nav: css`
      display: flex;
      gap: 0.25rem;
      align-items: center;
      align-self: stretch;

      min-width: 0;

      @media (width <= 47.5rem) {
        display: none;
      }
    `,

    navIndicator: css`
      position: absolute;
      inset-block: auto -1px;
      inset-inline: 0.75rem;

      height: 2px;
      border-radius: 1px;

      background: var(--docs-text-primary);
    `,

    navLink,

    productName: css`
      font-size: 1.125rem;
      font-weight: 700;
      line-height: 1;
      color: var(--docs-text-primary);
      letter-spacing: -0.02em;
    `,

    root: css`
      position: fixed;
      z-index: 100;
      inset-block: 0 auto;
      inset-inline: 0;

      height: var(--docs-header-height);
      border-block-end: 1px solid var(--docs-border-subtle);

      background: color-mix(in srgb, var(--docs-background) 86%, transparent);
      backdrop-filter: blur(18px) saturate(130%);
    `,

    search,

    sheet,

    sheetBackdrop,

    sheetHeading: css`
      position: sticky;
      z-index: 1;
      inset-block-start: 0;

      display: flex;
      align-items: center;
      justify-content: space-between;

      min-height: var(--docs-header-height);
      margin-block-end: 0.75rem;
      border-block-end: 1px solid var(--docs-border-subtle);

      font-size: 0.875rem;
      font-weight: 620;

      background: var(--docs-background);
    `,

    sheetLayer: css`
      position: fixed;
      z-index: 110;
      inset: 0;

      &[data-state='closing'] {
        .${sheetBackdrop} {
          opacity: 0;
        }

        .${sheet} {
          transform: translateX(-100%);
        }
      }
    `,

    wordmark: css`
      display: block;
      flex: none;
      width: auto;
      height: 28px;
    `,
  };
});
