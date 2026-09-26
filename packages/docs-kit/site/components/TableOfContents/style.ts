import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
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
}));
