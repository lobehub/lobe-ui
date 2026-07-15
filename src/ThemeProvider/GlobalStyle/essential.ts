import { css, type Theme } from 'antd-style';

import { CLASSNAMES } from '@/styles/classNames';

/**
 * Styles that library components rely on to render correctly (Flex layout,
 * popup trigger states, brand animations). Always injected by ThemeProvider,
 * independent of `enableGlobalStyle`, which only gates document-level resets.
 */
export default (token: Theme) => css`
  @layer lobe-popup {
    .${CLASSNAMES.ContextTrigger}[data-popup-open],
      .${CLASSNAMES.DropdownMenuTrigger}[data-popup-open] {
      background: ${token.colorFillTertiary};
    }
  }

  @layer lobe-base {
    :where(.lobe-flex) {
      /* Define defaults on the element itself to avoid CSS variable inheritance leaking to nested Flex */
      --lobe-flex: 0 1 auto;
      --lobe-flex-direction: column;
      --lobe-flex-wrap: nowrap;
      --lobe-flex-justify: flex-start;
      --lobe-flex-align: stretch;
      --lobe-flex-width: auto;
      --lobe-flex-height: auto;
      --lobe-flex-padding: 0;

      /* Keep padding-inline/block aligned with padding by default, and prevent inheriting from parent */
      --lobe-flex-padding-inline: var(--lobe-flex-padding);
      --lobe-flex-padding-block: var(--lobe-flex-padding);
      --lobe-flex-gap: 0;

      display: flex;
      flex: var(--lobe-flex);
      flex-flow: var(--lobe-flex-direction) var(--lobe-flex-wrap);
      gap: var(--lobe-flex-gap);
      align-items: var(--lobe-flex-align);
      justify-content: var(--lobe-flex-justify);

      width: var(--lobe-flex-width);
      height: var(--lobe-flex-height);
      padding: var(--lobe-flex-padding);
      padding-block: var(--lobe-flex-padding-block);
      padding-inline: var(--lobe-flex-padding-inline);
    }

    .lobe-flex-hidden {
      display: none;
    }
  }

  /* Brand Loading */
  @keyframes draw {
    0% {
      stroke-dashoffset: 1000;
    }

    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes fill {
    30% {
      fill-opacity: 0.05;
    }

    100% {
      fill-opacity: 1;
    }
  }

  .lobe-brand-loading path {
    fill: currentcolor;
    fill-opacity: 0;
    stroke: currentcolor;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    stroke-width: 0.25em;

    animation:
      draw 2s cubic-bezier(0.4, 0, 0.2, 1) infinite,
      fill 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
`;
