import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  code: css`
    margin: 0;

    font-size: clamp(3.5rem, 10vw, 5.5rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.05em;

    background: var(--docs-gradient-spectral);
    background-clip: text;

    -webkit-text-fill-color: transparent;
  `,

  link: css`
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;

    min-height: 2.5rem;
    margin-block-start: 2rem;
    padding-block: 0;
    padding-inline: 1.125rem;
    border: 1px solid var(--docs-border-default);
    border-radius: var(--docs-radius-md);

    font-size: 0.875rem;
    font-weight: 550;
    color: var(--docs-text-primary);
    text-decoration: none;

    background: var(--docs-surface-raised);

    transition:
      border-color 140ms ease,
      background-color 140ms ease;

    &:hover {
      border-color: var(--docs-border-strong);
      background: var(--docs-surface-hover);
    }
  `,

  root: css`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: min(100% - 2rem, 44rem);
    margin-inline: auto;
    padding-block: clamp(5rem, 18vh, 10rem);

    text-align: center;

    h1 {
      margin-block: 1rem 0;
      margin-inline: 0;

      font-size: clamp(1.375rem, 3vw, 1.75rem);
      font-weight: 640;
      color: var(--docs-text-primary);
      letter-spacing: -0.03em;
    }

    p:not(:first-of-type) {
      margin-block: 0.75rem 0;
      margin-inline: 0;
      line-height: 1.7;
      color: var(--docs-text-secondary);
    }
  `,
}));
