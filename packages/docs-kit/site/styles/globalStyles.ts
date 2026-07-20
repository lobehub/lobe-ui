import { createStaticStyles, injectGlobal } from 'antd-style';

injectGlobal`
  :root {
    color-scheme: light;

    --docs-header-height: 3.5rem;
    --docs-shell-max-width: 90rem;
    --docs-radius-lg: 0.75rem;
    --docs-radius-md: 0.5rem;
    --docs-radius-sm: 0.375rem;
    --docs-font-sans:
      'Geist', 'SF Pro Text', 'SF Pro Display', Inter, ui-sans-serif, system-ui, sans-serif;
    --docs-font-mono: 'Geist Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
    --docs-background: #ffffff;
    --docs-surface-raised: #ffffff;
    --docs-surface-muted: #f7f7f8;
    --docs-surface-hover: #f4f4f5;
    --docs-surface-active: #eeeeef;
    --docs-code-background: #fafafa;
    --docs-text-primary: #111113;
    --docs-text-secondary: #52525b;
    --docs-text-subtle: #71717a;
    --docs-border-subtle: #e9e9eb;
    --docs-border-default: #dedee1;
    --docs-border-strong: #c9c9ce;
    --docs-accent: #6257d9;
    --docs-accent-contrast: #ffffff;
    --docs-overlay: rgb(8 8 12 / 38%);
    --docs-ambient-violet: rgb(111 74 255 / 10%);
    --docs-ambient-cyan: rgb(52 201 211 / 7%);
    --docs-ambient-rose: rgb(242 92 166 / 5%);
    --docs-aurora-violet: rgb(140 100 255 / 16%);
    --docs-aurora-blue: rgb(70 180 240 / 14%);
    --docs-aurora-pink: rgb(250 120 180 / 11%);
    --docs-shadow-control: 0 1px 2px rgb(0 0 0 / 4%), 0 1px 6px rgb(0 0 0 / 3%);
    --docs-shadow-sheet: 16px 0 48px rgb(0 0 0 / 12%), 2px 0 8px rgb(0 0 0 / 7%);
    --docs-shadow-inset: inset 0 1px 0 rgb(255 255 255 / 60%);
    --docs-gradient-spectral: linear-gradient(105deg, #7c5cff 8%, #d6549e 55%, #f0885f 95%);
    --docs-syntax-plain: #27272d;
    --docs-syntax-comment: #8a8a93;
    --docs-syntax-punctuation: #71717a;
    --docs-syntax-keyword: #6d54e8;
    --docs-syntax-entity: #bb3d83;
    --docs-syntax-string: #c05621;
  }

  :root[data-theme='dark'] {
    color-scheme: dark;

    --docs-background: #0d0d0f;
    --docs-surface-raised: #151518;
    --docs-surface-muted: #19191d;
    --docs-surface-hover: #202024;
    --docs-surface-active: #26262b;
    --docs-code-background: #121214;
    --docs-text-primary: #f4f4f5;
    --docs-text-secondary: #b4b4bc;
    --docs-text-subtle: #888891;
    --docs-border-subtle: #26262b;
    --docs-border-default: #333338;
    --docs-border-strong: #45454b;
    --docs-accent: #8378f0;
    --docs-accent-contrast: #0d0d0f;
    --docs-overlay: rgb(0 0 0 / 62%);
    --docs-ambient-violet: rgb(112 80 255 / 13%);
    --docs-ambient-cyan: rgb(45 204 218 / 8%);
    --docs-ambient-rose: rgb(240 76 153 / 5%);
    --docs-aurora-violet: rgb(120 84 255 / 26%);
    --docs-aurora-blue: rgb(56 168 235 / 20%);
    --docs-aurora-pink: rgb(238 96 165 / 15%);
    --docs-shadow-control: 0 1px 2px rgb(0 0 0 / 24%), 0 1px 8px rgb(0 0 0 / 18%);
    --docs-shadow-sheet: 18px 0 56px rgb(0 0 0 / 36%), 2px 0 10px rgb(0 0 0 / 28%);
    --docs-shadow-inset: inset 0 1px 0 rgb(255 255 255 / 3%);
    --docs-gradient-spectral: linear-gradient(105deg, #a78bfa 8%, #ef7fc0 55%, #f8a878 95%);
    --docs-syntax-plain: #d6d6dd;
    --docs-syntax-comment: #6b6b76;
    --docs-syntax-punctuation: #888891;
    --docs-syntax-keyword: #a78bfa;
    --docs-syntax-entity: #ef7fc0;
    --docs-syntax-string: #f8a878;
  }

  * {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
    scroll-padding-top: calc(var(--docs-header-height) + 1.5rem);
    background: var(--docs-background);
    font-synthesis: none;
    text-size-adjust: 100%;
  }

  body {
    position: relative;
    min-width: 20rem;
    min-height: 100%;
    padding-top: var(--docs-header-height);
    margin: 0;
    color: var(--docs-text-primary);
    background-color: var(--docs-background);
    font-family: var(--docs-font-sans);
    font-feature-settings: 'kern', 'cv01';
    font-kerning: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizelegibility;
  }

  [data-ambient-glow] {
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    height: 36rem;
    pointer-events: none;
    background-image:
      radial-gradient(ellipse 60% 55% at 8% 0%, var(--docs-ambient-violet), transparent 70%),
      radial-gradient(ellipse 55% 50% at 50% 0%, var(--docs-ambient-cyan), transparent 70%),
      radial-gradient(ellipse 60% 55% at 92% 0%, var(--docs-ambient-rose), transparent 70%);
  }

  body:has([data-standalone-demo]) {
    padding-top: 0;
  }

  body:has([data-standalone-demo]) [data-ambient-glow] {
    display: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  a {
    color: inherit;
  }

  code,
  kbd,
  pre,
  samp {
    font-family: var(--docs-font-mono);
  }

  ::selection {
    color: var(--docs-accent-contrast);
    background: var(--docs-accent);
  }

  :focus-visible {
    outline: 2px solid var(--docs-accent);
    outline-offset: 3px;
  }

`;

export const styles = createStaticStyles(({ css }) => ({
  error: css`
    width: min(100% - 2rem, 44rem);
    margin-inline: auto;
    padding-block: 5rem;

    h1 {
      margin: 0;

      font-size: clamp(2rem, 5vw, 3.5rem);
      line-height: 1.05;
      text-wrap: balance;
      letter-spacing: -0.05em;
    }

    p {
      line-height: 1.7;
      color: var(--docs-text-secondary);
    }
  `,

  page: css`
    overflow-x: clip;
    display: flex;
    flex-direction: column;
    min-height: calc(100dvh - var(--docs-header-height));
  `,

  searchLoading: css`
    position: fixed;

    overflow: hidden;

    width: 1px;
    height: 1px;

    white-space: nowrap;

    clip-path: inset(50%);
  `,

  skipLink: css`
    position: fixed;
    z-index: 1000;
    inset-block-start: 0.5rem;
    inset-inline-start: 0.5rem;
    transform: translateY(calc(-100% - 1rem));

    padding-block: 0.65rem;
    padding-inline: 0.85rem;
    border-radius: 0.5rem;

    font-size: 0.875rem;
    font-weight: 620;
    color: var(--docs-accent-contrast);
    text-decoration: none;

    background: var(--docs-accent);

    transition: transform 140ms ease;

    &:focus-visible {
      transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `,
}));
