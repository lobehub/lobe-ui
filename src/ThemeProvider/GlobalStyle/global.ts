import { Theme, css } from 'antd-style';

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

  @layer lobe-base {
    @keyframes lobe-icon-spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .lobe-icon--spin {
      animation: lobe-icon-spin 1s linear infinite;
    }

    .lobe-block {
      position: relative;
      border-radius: ${token.borderRadius}px;
    }

    .lobe-block--clickable {
      cursor: pointer;
    }

    .lobe-block--filled {
      background: ${token.colorFillTertiary};
    }

    .lobe-block--outlined {
      border: 1px solid ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};
    }

    .lobe-block--borderless {
      border: none;
      background: none;
      box-shadow: none;
    }

    .lobe-block--clickable.lobe-block--filled {
      background: ${token.colorFillTertiary};

      &:hover {
        background: ${token.colorFillSecondary};
      }
    }

    .lobe-block--clickable.lobe-block--outlined {
      border: 1px solid ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};

      &:hover {
        border: 1px solid ${token.colorBorder};
        background: ${token.colorBgContainer};
      }
    }

    .lobe-block--clickable.lobe-block--borderless {
      border: none;
      background: none;
      box-shadow: none;

      &:hover {
        background: ${token.colorFillTertiary};
      }
    }

    .lobe-block--glass {
      backdrop-filter: saturate(150%) blur(10px);
    }

    .lobe-block--shadow {
      box-shadow:
        0 1px 0 -1px ${token.isDarkMode ? token.colorBgLayout : token.colorBorder},
        0 1px 2px -0.5px ${token.isDarkMode ? token.colorBgLayout : token.colorBorder},
        0 2px 2px -1px ${token.isDarkMode ? token.colorBgLayout : token.colorBorderSecondary},
        0 3px 6px -4px ${token.isDarkMode ? token.colorBgLayout : token.colorBorderSecondary};
    }

    .lobe-icon {
      display: inline-flex;
      align-items: center;
      color: inherit;
      font-style: normal;
      line-height: 0;
      text-align: center;
      text-transform: none;
      vertical-align: -0.125em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    .lobe-action-icon {
      cursor: pointer;

      position: relative;

      overflow: hidden;

      color: ${token.colorTextTertiary};

      transition:
        color 400ms ${token.motionEaseOut},
        background 100ms ${token.motionEaseOut};
    }

    .lobe-action-icon:hover {
      color: ${token.colorTextSecondary};
    }

    .lobe-action-icon:active {
      color: ${token.isDarkMode ? token.colorTextTertiary : token.colorText};
    }

    .lobe-action-icon--filled {
      background: ${token.colorFillTertiary};

      &:hover {
        background: ${token.colorFillSecondary};
      }
    }

    .lobe-action-icon--outlined {
      border: 1px solid ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};

      &:hover {
        border: 1px solid ${token.colorBorder};
        background: ${token.colorBgContainer};
      }
    }

    .lobe-action-icon--borderless {
      border: none;
      background: none;
      box-shadow: none;

      &:hover {
        background: ${token.colorFillTertiary};
      }
    }

    .lobe-action-icon--danger:hover {
      color: ${token.colorError};
    }

    .lobe-action-icon--danger:active {
      color: ${token.colorErrorActive};
    }

    .lobe-action-icon--danger.lobe-action-icon--filled {
      background: ${token.colorErrorFillTertiary};

      &:hover {
        background: ${token.colorErrorFillSecondary};
      }
    }

    .lobe-action-icon--danger.lobe-action-icon--outlined {
      border: 1px solid ${token.colorErrorBorder};

      &:hover {
        border: 1px solid ${token.colorErrorBorder};
      }
    }

    .lobe-action-icon--danger.lobe-action-icon--borderless {
      border: none;
      background: none;
      box-shadow: none;

      &:hover {
        background: ${token.colorErrorFillTertiary};
        box-shadow: inset 0 0 0 1px ${token.colorErrorFillTertiary};
      }
    }

    .lobe-action-icon--active {
      color: ${token.colorText};
      background: ${token.colorFillSecondary};

      &:hover {
        color: ${token.colorText};
        background: ${token.colorFill};
      }
    }

    .lobe-action-icon--disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .lobe-action-icon--glass {
      backdrop-filter: saturate(150%) blur(10px);
    }

    .lobe-action-icon--shadow {
      box-shadow:
        0 1px 0 -1px ${token.isDarkMode ? token.colorBgLayout : token.colorBorder},
        0 1px 2px -0.5px ${token.isDarkMode ? token.colorBgLayout : token.colorBorder},
        0 2px 2px -1px ${token.isDarkMode ? token.colorBgLayout : token.colorBorderSecondary},
        0 3px 6px -4px ${token.isDarkMode ? token.colorBgLayout : token.colorBorderSecondary};
    }

    .lobe-action-icon-group {
      position: relative;
      border-radius: ${token.borderRadius}px;
    }

    .lobe-action-icon-group--filled {
      background: ${token.colorFillTertiary};
    }

    .lobe-action-icon-group--outlined {
      border: 1px solid ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};
    }

    .lobe-action-icon-group--borderless {
      border: none;
      background: none;
      box-shadow: none;

      &:hover {
        background: ${token.colorFillTertiary};
      }
    }

    .lobe-action-icon-group--disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .lobe-action-icon-group--glass {
      backdrop-filter: saturate(150%) blur(10px);
    }

    .lobe-action-icon-group--shadow {
      box-shadow:
        0 1px 0 -1px ${token.isDarkMode ? token.colorBgLayout : token.colorBorder},
        0 1px 2px -0.5px ${token.isDarkMode ? token.colorBgLayout : token.colorBorder},
        0 2px 2px -1px ${token.isDarkMode ? token.colorBgLayout : token.colorBorderSecondary},
        0 3px 6px -4px ${token.isDarkMode ? token.colorBgLayout : token.colorBorderSecondary};
    }

    .lobe-flex {
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

    .lobe-flex--hidden {
      display: none;
    }
  }
`;
