import { Theme, css } from 'antd-style';

import { CLASSNAMES } from '@/styles/classNames';

import { LOBE_THEME_APP_ID } from '../constants';

export default (token: Theme) => css`
  :root {
    --font-settings: 'cv01', 'tnum', 'kern';
    --font-variations: 'opsz' auto, tabular-nums;

    text-autospace: normal;
  }

  html {
    overscroll-behavior: none;
    color-scheme: ${token.isDarkMode ? 'dark' : 'light'};
  }

  body {
    overflow: hidden auto;

    min-height: 100vh;
    margin: 0;
    padding: 0;

    font-family: ${token.fontFamily};
    font-size: ${token.fontSize}px;
    font-feature-settings: var(--font-settings);
    font-variation-settings: var(--font-variations);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1;
    color: ${token.colorTextBase};
    text-size-adjust: none;
    text-rendering: optimizelegibility;
    word-wrap: break-word;
    vertical-align: baseline;

    background-color: ${token.colorBgLayout};

    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: transparent;
  }

  code {
    font-family: ${token.fontFamilyCode} !important;

    span {
      font-family: ${token.fontFamilyCode} !important;
    }
  }

  ::selection {
    color: #000;
    background: ${token.yellow9};

    -webkit-text-fill-color: unset !important;
  }

  * {
    scrollbar-color: ${token.colorFill} transparent;
    scrollbar-width: thin;
    box-sizing: border-box;
    vertical-align: baseline;
  }
  #${LOBE_THEME_APP_ID} {
    /* https://base-ui.com/react/overview/quick-start#set-up-portals */
    isolation: isolate;
  }
  @layer lobe-popup {
    .${CLASSNAMES.ContextTrigger}[data-popup-open],
      .${CLASSNAMES.DropdownMenuTrigger}[data-popup-open] {
      background: ${token.colorFillTertiary};
    }
  }

  @layer lobe-base {
    :where(.lobe-flex),
    lobe-flex {
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
      flex-direction: var(--lobe-flex-direction);
      flex-wrap: var(--lobe-flex-wrap);
      justify-content: var(--lobe-flex-justify);
      align-items: var(--lobe-flex-align);

      width: var(--lobe-flex-width);
      height: var(--lobe-flex-height);

      padding: var(--lobe-flex-padding);
      padding-inline: var(--lobe-flex-padding-inline);
      padding-block: var(--lobe-flex-padding-block);

      gap: var(--lobe-flex-gap);
    }

    .lobe-flex--hidden,
    lobe-flex[hidden] {
      display: none;
    }

    lobe-flex {
      text-align: left;
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
      fill-opacity: 5%;
    }

    100% {
      fill-opacity: 100%;
    }
  }

  .lobe-brand-loading path {
    fill: currentcolor;
    fill-opacity: 0%;
    stroke: currentcolor;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    stroke-width: 0.25em;

    animation:
      draw 2s cubic-bezier(0.4, 0, 0.2, 1) infinite,
      fill 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
`;
