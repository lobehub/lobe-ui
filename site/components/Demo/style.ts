import { createStaticStyles, injectGlobal } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  actions: css`
    display: flex;
    flex: none;
    gap: 0.125rem;
    align-items: center;

    margin-inline-start: auto;
  `,

  caption: css`
    display: flex;
    gap: 0.5rem;
    align-items: center;

    min-height: 2.25rem;
    padding-block: 0.25rem;
    padding-inline: 0.875rem 0.5rem;
    border-block-end: 1px solid var(--docs-border-subtle);

    h3 {
      flex: none;

      margin: 0;
      padding: 0;

      font-size: 0.8438rem;
      font-weight: 620;
      line-height: 1.4;
      color: var(--docs-text-primary);
      letter-spacing: -0.01em;
    }

    p {
      overflow: hidden;

      min-width: 0;
      margin: 0;

      font-size: 0.7813rem;
      line-height: 1.5;
      color: var(--docs-text-subtle);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (width <= 47.5rem) {
      padding-inline: 0.75rem 0.5rem;
    }
  `,

  error: css`
    display: grid;
    gap: 0.75rem;
    align-content: center;
    justify-items: start;

    min-height: var(--demo-frame-height, 10rem);
    padding: 1.5rem;

    color: var(--docs-text-secondary);

    background: var(--docs-surface-muted);

    strong {
      color: var(--docs-text-primary);
    }

    code {
      max-width: 100%;
      font-size: 0.75rem;
      color: var(--docs-text-secondary);
      overflow-wrap: anywhere;
    }

    button {
      cursor: pointer;

      min-width: 2.5rem;
      min-height: 2.5rem;
      padding-block: 0;
      padding-inline: 0.875rem;
      border: 1px solid var(--docs-border-default);
      border-radius: 0.5rem;

      color: var(--docs-text-primary);

      background: var(--docs-surface-raised);
      box-shadow: var(--docs-shadow-control);

      transition:
        color 140ms ease,
        background-color 140ms ease,
        border-color 140ms ease,
        box-shadow 140ms ease,
        transform 90ms ease;

      &:hover {
        border-color: var(--docs-border-strong);
        background: var(--docs-surface-hover);
      }

      &:active {
        transform: scale(0.96);
      }

      @media (prefers-reduced-motion: reduce) {
        transition-duration: 0.01ms;
      }
    }

    @media (width <= 47.5rem) {
      padding: 1rem;
    }
  `,

  frame: css`
    position: relative;

    overflow: hidden;

    margin-block: 1.75rem;
    margin-inline: 0;
    border: 1px solid var(--docs-border-default);
    border-radius: var(--docs-radius-lg);

    background: var(--docs-surface-raised);
    box-shadow: var(--docs-shadow-control);

    transition:
      border-color 180ms ease,
      box-shadow 180ms ease;

    &:hover,
    &:focus-within {
      border-color: color-mix(in srgb, var(--docs-accent) 32%, var(--docs-border-default));
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--docs-accent) 10%, transparent),
        var(--docs-shadow-control);
    }

    &:fullscreen {
      overflow: auto;

      margin: 0;
      border: 0;
      border-radius: 0;

      background: var(--docs-background);
      box-shadow: none;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `,

  iframe: css`
    display: block;

    width: 100%;
    min-height: var(--demo-frame-height, 24rem);
    border: 0;

    background: var(--docs-background);
  `,

  liveBadge: css`
    pointer-events: none;

    position: absolute;
    inset-block-start: 0.5rem;
    inset-inline-end: 0.5rem;

    padding-block: 0.0625rem;
    padding-inline: 0.4375rem;
    border: 1px solid color-mix(in srgb, var(--docs-accent) 35%, transparent);
    border-radius: 999px;

    font-size: 0.625rem;
    font-weight: 560;
    color: var(--docs-accent);
    text-transform: uppercase;
    letter-spacing: 0.04em;

    background: color-mix(in srgb, var(--docs-accent) 10%, var(--docs-background));
  `,

  liveCandidate: css`
    grid-area: 1 / 1;
    min-width: 0;

    &[data-live-state='candidate'],
    &[data-live-state='fallback'] {
      pointer-events: none;
      visibility: hidden;
      opacity: 0;
    }
  `,

  liveDiagnostics: css`
    padding-block: 0.75rem;
    padding-inline: 1.25rem;
    border-block-start: 1px solid var(--docs-border-subtle);

    font-size: 0.75rem;
    line-height: 1.55;
    color: var(--docs-danger-text, #b42318);

    background: color-mix(in srgb, #ef4444 8%, var(--docs-surface-muted));

    p {
      margin: 0;
    }

    p + p {
      margin-block-start: 0.375rem;
    }
  `,

  liveImports: css`
    user-select: text;

    position: relative;

    overflow: auto;

    margin: 0;
    padding-block: 1rem 0.25rem;
    padding-inline: 1.25rem;
    border: 0;
    border-radius: 0;

    font-size: 0.75rem;
    line-height: 1.65;
    color: var(--docs-text-subtle);
    tab-size: 2;

    background: var(--docs-code-background);
    box-shadow: none;

    &::before {
      content: '';

      position: absolute;
      inset-block: 1.125rem 0.375rem;
      inset-inline-start: 0.625rem;

      width: 2px;
      border-radius: 2px;

      background: var(--docs-border-strong);
    }

    @media (width <= 47.5rem) {
      padding-inline: 1rem;
    }
  `,

  liveInput: css`
    overflow: auto;

    max-height: 32rem;

    font-family: var(--docs-font-mono);
    font-size: 0.75rem;
    line-height: 1.65;
    color: var(--docs-text-primary);

    background: var(--docs-code-background);

    pre {
      min-height: 8rem;
      margin: 0;
      padding-block: 1rem !important;
      padding-inline: 1.25rem !important;
      border: 0;
      border-radius: 0;

      box-shadow: none;

      @media (width <= 47.5rem) {
        padding-inline: 1rem !important;
      }
    }

    [data-demo-live-imports] + & pre {
      padding-block-start: 0.5rem !important;
    }
  `,

  liveSource: css`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    background: var(--docs-code-background);
  `,

  liveStage: css`
    display: grid;
    min-height: inherit;

    &[hidden] {
      display: none;
    }
  `,

  liveStatus: css`
    padding-block: 0.75rem;
    padding-inline: 1.25rem;
    border-block-start: 1px solid var(--docs-border-subtle);

    font-size: 0.75rem;
    line-height: 1.55;
    color: var(--docs-text-secondary);

    background: var(--docs-surface-muted);
  `,

  placeholder: css`
    display: grid;
    place-items: center;

    min-height: var(--demo-frame-height, 10rem);

    font-size: 0.8125rem;
    color: var(--docs-text-subtle);
  `,

  preview: css`
    display: block;

    width: 100%;
    min-height: var(--demo-frame-height, 10rem);
    padding: 1.5rem;

    background: var(--docs-background);

    [data-demo-appearance='light'] > & {
      color: #111113;
      color-scheme: light;
      background: #fff;
    }

    [data-demo-appearance='dark'] > & {
      color: #f4f4f5;
      color-scheme: dark;
      background: #0d0d0f;
    }

    [data-demo-layout='center'] & {
      display: grid;
      place-items: center;
    }

    [data-demo-layout='bare'] & {
      padding: 0;
    }

    @media (width <= 47.5rem) {
      padding: 1rem;
    }
  `,

  source: css`
    overflow: auto;

    margin: 0;
    padding-block: 1rem;
    padding-inline: 1.25rem;

    font-size: 0.75rem;
    line-height: 1.65;
    color: var(--docs-text-primary);
    tab-size: 2;

    background: var(--docs-code-background);

    @media (width <= 47.5rem) {
      padding-inline: 1rem;
    }
  `,

  sourcePanel: css`
    border-block-start: 1px solid var(--docs-border-subtle);
    background: var(--docs-code-background);
  `,

  standalonePage: css`
    display: grid;
    place-items: center;

    min-width: 20rem;
    min-height: 100dvh;
    padding: 1.5rem;

    background: var(--docs-background);

    &[data-demo-appearance='light'] {
      color: #111113;
      color-scheme: light;
      background: #fff;
    }

    &[data-demo-appearance='dark'] {
      color: #f4f4f5;
      color-scheme: dark;
      background: #0d0d0f;
    }

    > [data-demo-placeholder],
    > [id^='lobe-demo-'] {
      width: 100%;
    }
  `,

  standalonePageError: css`
    align-content: center;
    justify-items: start;
    max-width: 44rem;
    margin-inline: auto;

    h1,
    p {
      margin: 0;
    }

    p {
      margin-block-start: 0.75rem;
      color: var(--docs-text-secondary);
    }
  `,

  status: css`
    position: absolute;

    overflow: hidden;

    width: 1px;
    height: 1px;

    white-space: nowrap;

    clip: rect(0 0 0 0);
    clip-path: inset(50%);
  `,

  viewport: css`
    position: relative;

    overflow: auto;
    display: flex;
    justify-content: center;

    width: 100%;

    background: var(--docs-surface-muted);

    &[data-demo-viewport='tablet'] > * {
      width: min(100%, 48rem);
    }

    &[data-demo-viewport='mobile'] > * {
      width: min(100%, 24.375rem);
    }
  `,
}));

injectGlobal`
  :root[data-standalone-appearance='light'] [data-standalone-demo] {
    color: #111113;
    color-scheme: light;
    background: #fff;
  }

  :root[data-standalone-appearance='dark'] [data-standalone-demo] {
    color: #f4f4f5;
    color-scheme: dark;
    background: #0d0d0f;
  }
`;
