import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  const chevron = css`
    flex: none;
    margin-inline-start: auto;
    color: var(--docs-text-subtle);
    transition: transform 140ms ease;

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `;

  const panel = css`
    max-height: min(50dvh, 20rem);
    padding-block: 0.5rem 0.75rem;
    padding-inline: 0;
    border-block-start: 1px solid var(--docs-border-subtle);

    background: var(--docs-background);

    ol {
      display: grid;
      gap: 0.125rem;

      margin: 0;
      padding: 0;

      list-style: none;
    }

    a {
      display: flex;
      align-items: center;

      min-height: 1.875rem;

      font-size: 0.8125rem;
      line-height: 1.25rem;
      color: var(--docs-text-subtle);
      text-decoration: none;

      transition: color 140ms ease;

      &:hover {
        color: var(--docs-text-primary);
      }

      &[aria-current] {
        font-weight: 540;
        color: var(--docs-text-primary);
      }
    }

    li[data-level='3'] a {
      padding-inline-start: 0.75rem;
    }
  `;

  return {
    bar: css`
      position: sticky;
      z-index: 40;
      inset-block-start: 0;

      display: none;
      grid-column: 2;
      order: -1;

      border-block-end: 1px solid var(--docs-border-subtle);

      background: color-mix(in srgb, var(--docs-background) 92%, transparent);
      backdrop-filter: blur(8px);

      @container docs (width < 87rem) {
        display: block;
      }
    `,

    chevron,

    current: css`
      overflow: hidden;
      min-width: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,

    label: css`
      flex: none;

      font-size: 0.6875rem;
      font-weight: 560;
      color: var(--docs-text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    `,

    panel,

    panelScroll: css`
      overflow: hidden;
      max-height: calc(min(50dvh, 20rem) - 1.25rem);
      border-radius: 0;
      background: none;
    `,

    panelViewport: css`
      max-height: calc(min(50dvh, 20rem) - 1.25rem);
    `,

    scrollArea: css`
      overflow: hidden;

      width: 100%;
      max-height: calc(var(--docs-viewport-height) - 4rem - 1.875rem);
      border-radius: 0;

      background: none;
    `,

    scrollContent: css`
      gap: 0;
      min-width: 0;
      padding-inline-end: 0.5rem;
    `,

    scrollbar: css`
      margin-block: 0.25rem;
      margin-inline: 0 0.125rem;
    `,

    viewport: css`
      max-height: calc(var(--docs-viewport-height) - 4rem - 1.875rem);
    `,

    root: css`
      position: sticky;
      inset-block-start: 2rem;

      overflow: hidden;
      grid-column: 3;
      place-self: start end;

      max-width: calc(100% - 1.5rem);
      max-height: calc(var(--docs-viewport-height) - 4rem);
      margin-block-start: clamp(2.75rem, 6vw, 5rem);
      margin-inline-end: 1.5rem;

      h2 {
        margin-block: 0 0.625rem;
        margin-inline: 0;

        font-size: 0.75rem;
        font-weight: 620;
        line-height: 1.25rem;
        color: var(--docs-text-primary);
        letter-spacing: -0.005em;
      }

      ol {
        display: grid;
        gap: 0.125rem;

        margin: 0;
        padding: 0;
        border-inline-start: 1px solid var(--docs-border-subtle);

        list-style: none;
      }

      a {
        position: relative;

        display: flex;
        align-items: center;

        min-height: 1.875rem;
        padding-inline-start: 0.875rem;

        font-size: 0.8125rem;
        line-height: 1.25rem;
        color: var(--docs-text-subtle);
        text-decoration: none;

        transition: color 140ms ease;

        &::before {
          content: '';

          position: absolute;
          inset-block: 0.375rem;
          inset-inline-start: -1px;

          width: 1px;

          opacity: 0;
          background: var(--docs-text-primary);

          transition: opacity 140ms ease;
        }

        &:hover {
          color: var(--docs-text-primary);
        }

        &[aria-current] {
          font-weight: 540;
          color: var(--docs-text-primary);

          &::before {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          transition-duration: 0.01ms;
        }
      }

      li[data-level='3'] a {
        padding-inline-start: 1.625rem;
      }

      @container docs (width < 87rem) {
        display: none;
      }
    `,

    trigger: css`
      cursor: pointer;

      display: flex;
      gap: 0.5rem;
      align-items: center;

      width: 100%;
      min-height: 2.5rem;
      padding-block: 0;
      padding-inline: 0;
      border: 0;

      font: inherit;
      font-size: 0.8125rem;
      color: var(--docs-text-primary);
      text-align: start;

      background: none;

      &[aria-expanded='true'] {
        .${chevron} {
          transform: rotate(180deg);
        }
      }
    `,
  };
});
