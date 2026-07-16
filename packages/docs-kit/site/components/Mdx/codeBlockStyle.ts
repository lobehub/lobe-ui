import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  root: css`
    overflow: hidden;

    max-width: 100%;
    margin-block: 1.5rem;
    margin-inline: 0;
    border: 1px solid var(--docs-border-subtle);
    border-radius: var(--docs-radius-lg);

    font-size: 0.8125rem;
    line-height: 1.7;

    background: var(--docs-code-background);
    box-shadow: var(--docs-shadow-inset);

    pre {
      margin: 0 !important;
      padding: 1.25rem !important;
      border: none !important;
      border-radius: 0 !important;

      background: transparent !important;
      box-shadow: none !important;
    }
  `,
}));
