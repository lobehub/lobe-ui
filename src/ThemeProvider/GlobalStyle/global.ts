import { css, type Theme } from 'antd-style';

import { CLASSNAMES } from '@/styles/classNames';

export default (token: Theme) => css`
  :root {
    --font-settings: 'cv01', 'tnum', 'kern';
    --font-variations: 'opsz' auto, tabular-nums;

    /* Real Geist italic for Latin; synthesize style for CJK fallback faces. */
    font-synthesis: style;
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
    font-optical-sizing: auto;
    font-kerning: normal;
    font-variant-ligatures: common-ligatures contextual;
    font-variant-numeric: tabular-nums;
    font-size-adjust: from-font;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1;
    color: ${token.colorTextBase};
    text-wrap: pretty;
    text-size-adjust: 100%;
    text-size-adjust: 100%;
    text-rendering: optimizelegibility;
    overflow-wrap: anywhere;
    vertical-align: baseline;

    background-color: ${token.colorBgLayout};

    font-synthesis: style;

    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: transparent;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: ${token.fontFamilyCode} !important;
    font-feature-settings:
      'liga' 0,
      'calt' 0;
    font-variant-ligatures: none;

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
