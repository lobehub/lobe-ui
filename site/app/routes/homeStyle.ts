import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  button: css`
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;

    min-height: 2.75rem;
    padding-block: 0;
    padding-inline: 1.5rem;
    border: 1px solid transparent;
    border-radius: 999px;

    font-size: 0.875rem;
    font-weight: 600;
    color: var(--docs-text-primary);
    text-decoration: none;

    background-image:
      linear-gradient(var(--docs-surface-raised), var(--docs-surface-raised)),
      var(--docs-gradient-spectral);
    background-clip: padding-box, border-box;
    background-origin: border-box;

    transition:
      background-color 140ms ease,
      filter 140ms ease,
      transform 90ms ease;

    &:hover {
      background-image:
        linear-gradient(var(--docs-surface-hover), var(--docs-surface-hover)),
        var(--docs-gradient-spectral);
    }

    &:active {
      transform: scale(0.98);
    }
  `,

  buttonPrimary: css`
    color: var(--docs-background);
    background-color: var(--docs-text-primary);
    background-image: none;

    &:hover {
      background-color: color-mix(in srgb, var(--docs-text-primary) 86%, var(--docs-background));
      background-image: none;
    }
  `,

  document: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 100%;
  `,

  feature: css`
    padding-block: 1.25rem 1.375rem;
    padding-inline: 1.25rem;
    border: 1px solid var(--docs-border-subtle);
    border-radius: 0.875rem;

    background: color-mix(in srgb, var(--docs-surface-raised) 62%, transparent);

    transition: border-color 140ms ease;

    &:hover {
      border-color: var(--docs-border-strong);
    }

    h3 {
      margin-block: 0.875rem 0.375rem;
      margin-inline: 0;

      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--docs-text-primary);
      letter-spacing: -0.01em;
    }

    p {
      margin: 0;
      font-size: 0.8438rem;
      line-height: 1.65;
      color: var(--docs-text-secondary);
    }
  `,

  featureIcon: css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 1.875rem;
    height: 1.875rem;
    border-radius: 0.5625rem;

    color: var(--docs-accent);

    background: color-mix(in srgb, var(--docs-accent) 10%, transparent);
  `,

  features: css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    padding-block-end: clamp(3rem, 8vh, 6rem);

    @media (width <= 47.5rem) {
      grid-template-columns: 1fr;
    }
  `,

  hero: css`
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding-block: clamp(5rem, 14vh, 8.5rem) clamp(3rem, 7vh, 4.5rem);
    padding-inline: 0;

    text-align: center;

    &::before {
      pointer-events: none;
      content: '';

      position: absolute;
      z-index: -1;
      inset-block: calc(-1 * var(--docs-header-height) - 2rem) 0;
      inset-inline: 0;

      background:
        radial-gradient(38% 55% at 22% 8%, var(--docs-aurora-violet), transparent 70%),
        radial-gradient(30% 50% at 58% 0%, var(--docs-aurora-blue), transparent 70%),
        radial-gradient(26% 45% at 84% 12%, var(--docs-aurora-pink), transparent 70%);
    }

    h1 {
      margin: 0;

      font-size: clamp(3.25rem, 8vw, 5.5rem);
      font-weight: 700;
      line-height: 1.02;
      color: var(--docs-text-primary);
      text-wrap: balance;
      letter-spacing: -0.045em;
    }

    p {
      max-width: 34rem;
      margin-block: 1.375rem 0;
      margin-inline: 0;

      font-size: clamp(1.0625rem, 2vw, 1.25rem);
      line-height: 1.6;
      color: var(--docs-text-secondary);
      text-wrap: balance;
    }
  `,

  heroActions: css`
    display: flex;
    gap: 0.75rem;
    margin-block-start: 2.5rem;
  `,

  heroGradient: css`
    background: var(--docs-gradient-spectral);
    background-clip: text;

    -webkit-text-fill-color: transparent;
  `,

  install: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-block: 1.25rem 3.75rem;

    h2 {
      margin-block: 0 1rem;
      margin-inline: 0;

      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--docs-text-secondary);
    }
  `,

  installCommand: css`
    display: flex;
    gap: 0.5rem;
    align-items: center;

    padding-block: 0.4375rem;
    padding-inline: 1rem 0.4375rem;
    border: 1px solid var(--docs-border-subtle);
    border-radius: 999px;

    background: var(--docs-code-background);
    box-shadow: var(--docs-shadow-control);

    code {
      font-size: 0.8438rem;
      color: var(--docs-text-primary);

      &::before {
        content: '$';
        margin-inline-end: 0.5rem;
        color: var(--docs-accent);
      }
    }
  `,

  root: css`
    display: flex;
    flex-direction: column;

    width: min(100% - 3rem, 64rem);
    min-height: calc(100dvh - var(--docs-header-height));
    margin-inline: auto;

    @media (width <= 47.5rem) {
      width: min(100% - 2rem, 64rem);
    }
  `,
}));
