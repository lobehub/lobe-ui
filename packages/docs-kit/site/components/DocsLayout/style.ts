import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  const paginationArrow = css`
    flex: none;
    color: var(--docs-text-subtle);
    transition: color 140ms ease;
  `;

  const paginationText = css`
    display: grid;
    gap: 0.125rem;
    min-width: 0;

    > span {
      font-size: 0.7188rem;
      color: var(--docs-text-subtle);
    }

    > strong {
      overflow: hidden;

      font-size: 0.875rem;
      font-weight: 560;
      color: var(--docs-text-secondary);
      text-overflow: ellipsis;
      white-space: nowrap;

      transition: color 140ms ease;
    }
  `;

  const paginationLink = css`
    display: inline-flex;
    gap: 0.625rem;
    align-items: center;

    min-width: 0;

    text-decoration: none;

    &:hover {
      strong {
        color: var(--docs-text-primary);
      }

      svg {
        color: var(--docs-text-primary);
      }
    }
  `;

  const paginationLinkNext = css`
    text-align: end;
  `;

  return {
    content: css`
      font-size: 0.9688rem;
      line-height: 1.8;
      color: var(--docs-text-secondary);

      > :first-child {
        margin-block-start: 0;
      }

      h2,
      h3 {
        scroll-margin-top: calc(var(--docs-header-height) + 1.5rem);
        color: var(--docs-text-primary);
        text-wrap: balance;
        letter-spacing: -0.025em;
      }

      h2 {
        margin-block: 3.5rem 1rem;
        margin-inline: 0;
        padding-block-start: 1rem;

        font-size: 1.625rem;
        font-weight: 640;
        line-height: 1.25;
      }

      h3 {
        margin-block: 2.25rem 0.75rem;
        margin-inline: 0;

        font-size: 1.125rem;
        font-weight: 620;
        line-height: 1.35;
      }

      p {
        max-width: 68ch;
        margin-block: 1rem;
        margin-inline: 0;
        text-wrap: pretty;
      }

      pre:not(:where([data-code-type='highlighter'] *)) {
        overflow-x: auto;

        max-width: 100%;
        margin-block: 1.5rem;
        margin-inline: 0;
        padding: 1.25rem;
        border: 1px solid var(--docs-border-subtle);
        border-radius: var(--docs-radius-lg);

        font-size: 0.8125rem;
        line-height: 1.7;

        background: var(--docs-code-background);
        box-shadow: var(--docs-shadow-inset);
      }

      :where(:not(pre)) > code {
        padding-block: 0.15em;
        padding-inline: 0.4em;
        border: 1px solid var(--docs-border-subtle);
        border-radius: 0.35rem;

        font-size: 0.85em;
        color: var(--docs-text-primary);

        background: var(--docs-surface-muted);
      }

      table {
        overflow-x: auto;
        display: block;
        border-spacing: 0;
        border-collapse: collapse;

        width: max-content;
        max-width: 100%;
        margin-block: 1.5rem;
        margin-inline: 0;
        border: 1px solid var(--docs-border-default);
        border-radius: var(--docs-radius-lg);

        text-align: start;

        background: var(--docs-surface-raised);
        box-shadow: var(--docs-shadow-inset);
      }

      thead {
        background: var(--docs-surface-muted);
      }

      tr + tr {
        border-block-start: 1px solid var(--docs-border-subtle);
      }

      th,
      td {
        min-width: 7.5rem;
        padding-block: 0.75rem;
        padding-inline: 1rem;

        font-size: 0.875rem;
        line-height: 1.55;
        text-align: start;
        overflow-wrap: break-word;
        vertical-align: top;
      }

      th {
        font-weight: 620;
        color: var(--docs-text-primary);
        white-space: nowrap;
      }

      td {
        color: var(--docs-text-secondary);
      }

      td code {
        font-size: 0.8125em;
        overflow-wrap: anywhere;
      }
    `,

    document: css`
      min-width: 0;
    `,

    header: css`
      margin-block-end: 2.5rem;
      padding-block-end: 2rem;
      border-block-end: 1px solid var(--docs-border-subtle);

      h1 {
        max-width: 20ch;
        margin: 0;

        font-size: clamp(1.875rem, 3.5vw, 2.5rem);
        font-weight: 660;
        line-height: 1.08;
        color: var(--docs-text-primary);
        text-wrap: balance;
        letter-spacing: -0.045em;
      }

      p {
        max-width: 42rem;
        margin-block: 0.75rem 0;
        margin-inline: 0;

        font-size: 1rem;
        line-height: 1.7;
        color: var(--docs-text-secondary);
        text-wrap: pretty;
      }

      @media (width <= 47.5rem) {
        margin-block-end: 2rem;
        padding-block-end: 1.5rem;

        h1 {
          max-width: 18ch;
        }
      }
    `,

    headingAnchor: css`
      display: inline-flex;
      align-items: center;

      margin-inline-start: 0.375rem;

      color: var(--docs-text-subtle);
      text-decoration: none;
      vertical-align: middle;

      opacity: 0;

      transition: opacity 140ms ease;

      &:hover {
        color: var(--docs-accent);
      }

      :where(h1, h2, h3, h4):hover > &,
      &:focus-visible {
        opacity: 1;
      }
    `,

    importBlock: css`
      display: flex;
      gap: 0.5rem;
      align-items: center;

      max-width: fit-content;
      margin-block-start: 1.25rem;
      padding-block: 0.375rem;
      padding-inline: 0.75rem 0.375rem;
      border: 1px solid var(--docs-border-subtle);
      border-radius: var(--docs-radius-md);

      background: var(--docs-code-background);

      code {
        overflow-x: auto;

        font-size: 0.8125rem;
        line-height: 1.5rem;
        color: var(--docs-syntax-plain);
        white-space: nowrap;
      }
    `,

    linkIcon: css`
      flex: none;
      margin-inline-end: 0.25rem;
    `,

    links: css`
      display: flex;
      gap: 1.25rem;
      align-items: center;
      margin-block-start: 1rem;

      a {
        display: inline-flex;
        gap: 0.125rem;
        align-items: center;

        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--docs-text-subtle);
        text-decoration: none;

        transition: color 140ms ease;

        &:hover {
          color: var(--docs-text-primary);
        }
      }
    `,

    pagination: css`
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      margin-block-start: 3rem;
    `,

    paginationArrow,

    paginationLink,

    paginationLinkNext,

    paginationText,

    root: css`
      display: grid;
      grid-template-columns: minmax(12rem, 15rem) minmax(0, 47rem) minmax(10rem, 13rem);
      gap: clamp(2rem, 4vw, 3.5rem);
      align-items: start;
      justify-content: center;

      width: min(100% - 3rem, var(--docs-shell-max-width));
      min-height: calc(100dvh - var(--docs-header-height));
      margin-block: 0;
      margin-inline: auto;
      padding-block: clamp(2.75rem, 6vw, 5rem) 7rem;
      padding-inline: 0;

      &[data-sidebar='false'] {
        grid-template-columns: minmax(0, 47rem) minmax(10rem, 13rem);
      }

      @media (width <= 74rem) {
        grid-template-columns: minmax(12rem, 15rem) minmax(0, 47rem);
        width: min(100% - 2.5rem, 68rem);

        &[data-sidebar='false'] {
          grid-template-columns: minmax(0, 47rem);
        }
      }

      @media (width <= 47.5rem) {
        display: block;
        width: min(100% - 2rem, 47rem);
        padding-block: 2.5rem 5rem;
      }
    `,

    searchMetadata: css`
      position: absolute;

      overflow: hidden;

      width: 1px;
      height: 1px;

      white-space: nowrap;

      clip-path: inset(50%);
    `,

    sidebar: css`
      position: sticky;
      inset-block-start: calc(var(--docs-header-height) + 2rem);

      overflow: hidden;
      align-self: start;

      max-height: calc(100dvh - var(--docs-header-height) - 4rem);
      padding-inline-end: 0.25rem;

      @media (width <= 47.5rem) {
        display: none;
      }
    `,

    sidebarContent: css`
      gap: 0;
      min-width: 0;
      padding-inline-end: 0.75rem;
    `,

    sidebarScroll: css`
      overflow: hidden;

      width: 100%;
      max-height: calc(100dvh - var(--docs-header-height) - 4rem);
      border-radius: 0;

      background: none;
    `,

    sidebarScrollbar: css`
      margin-block: 0.5rem;
      margin-inline: 0 0.125rem;
    `,

    sidebarViewport: css`
      max-height: calc(100dvh - var(--docs-header-height) - 4rem);
    `,

    syntaxEntity: css`
      color: var(--docs-syntax-entity);
    `,

    syntaxKeyword: css`
      color: var(--docs-syntax-keyword);
    `,

    syntaxPunctuation: css`
      color: var(--docs-syntax-punctuation);
    `,

    syntaxString: css`
      color: var(--docs-syntax-string);
    `,
  };
});
