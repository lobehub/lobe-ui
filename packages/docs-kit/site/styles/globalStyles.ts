import { createStaticStyles, injectGlobal } from 'antd-style';

injectGlobal`
  :root {
    color-scheme: light;

    /* Visible height of the shell workspace: 56px top bar, 8px insets, 1px borders. */
    --docs-viewport-height: calc(100dvh - 4.625rem);
    --docs-shell-max-width: 90rem;
    --docs-radius-lg: 0.75rem;
    --docs-radius-md: 0.5rem;
    --docs-radius-sm: 0.375rem;
    --docs-font-sans: 'SF Pro Text', 'SF Pro Display', Inter, ui-sans-serif, system-ui, sans-serif;
    --docs-font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
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
    --docs-accent: var(--ant-color-primary);
    --docs-accent-contrast: var(--ant-color-bg-layout);
    --docs-overlay: rgb(8 8 12 / 38%);
    --docs-aurora-violet: rgb(140 100 255 / 16%);
    --docs-aurora-blue: rgb(70 180 240 / 14%);
    --docs-aurora-pink: rgb(250 120 180 / 11%);
    --docs-shadow-control: 0 1px 2px rgb(0 0 0 / 4%), 0 1px 6px rgb(0 0 0 / 3%);
    --docs-shadow-inset: inset 0 1px 0 rgb(255 255 255 / 60%);
    --docs-gradient-spectral: linear-gradient(105deg, #7c5cff 8%, #d6549e 55%, #f0885f 95%);
    --lobe-landing-gradient: var(--docs-gradient-spectral);
  }

  @media (max-width: 991px) {
    :root {
      --docs-viewport-height: calc(100dvh - 3.5rem - 1px);
    }
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
    --docs-accent: var(--ant-color-primary);
    --docs-accent-contrast: var(--ant-color-bg-layout);
    --docs-overlay: rgb(0 0 0 / 62%);
    --docs-aurora-violet: rgb(120 84 255 / 26%);
    --docs-aurora-blue: rgb(56 168 235 / 20%);
    --docs-aurora-pink: rgb(238 96 165 / 15%);
    --docs-shadow-control: 0 1px 2px rgb(0 0 0 / 24%), 0 1px 8px rgb(0 0 0 / 18%);
    --docs-shadow-inset: inset 0 1px 0 rgb(255 255 255 / 3%);
    --docs-gradient-spectral: linear-gradient(105deg, #a78bfa 8%, #ef7fc0 55%, #f8a878 95%);
  }

  * {
    box-sizing: border-box;
  }

  html {
    overflow: hidden;
    height: 100%;
    background: var(--docs-background);
    font-synthesis: none;
    text-size-adjust: 100%;
  }

  body {
    position: relative;

    overflow: hidden;

    width: 100%;
    min-width: 20rem;
    height: 100%;
    margin: 0;
    padding: 0;

    color: var(--docs-text-primary);
    background-color: var(--docs-background);
    font-family: var(--docs-font-sans);
    font-feature-settings: 'kern';
    font-kerning: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizelegibility;
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
    display: flex;
    flex: 1;
    flex-direction: column;

    min-width: 0;
    min-block-size: 0;
  `,

  searchLoading: css`
    position: fixed;

    overflow: hidden;

    width: 1px;
    height: 1px;

    white-space: nowrap;

    clip-path: inset(50%);
  `,
}));
