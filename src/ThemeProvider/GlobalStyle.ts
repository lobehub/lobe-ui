import { createGlobalStyle } from 'antd-style';

const GlobalStyle = createGlobalStyle`

  html,body {
    --font-settings: "cv01", "tnum", "kern";
    --font-variations: "opsz" auto, tabular-nums;

    overflow-x: hidden;
    overflow-y: auto;

    margin: 0;
    padding: 0;

    font-family: ${({ theme }) => theme.fontFamily};
    font-size: ${({ theme }) => theme.fontSize}px;
    font-feature-settings: var(--font-settings);
    font-variation-settings: var(--font-variations);
    line-height: 1;
    color: ${({ theme }) => theme.colorTextBase};
    text-size-adjust: none;
    text-rendering: optimizelegibility;
    vertical-align: baseline;

    color-scheme: dark;
    background-color: ${({ theme }) => theme.colorBgLayout};

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-overflow-scrolling:touch;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    overflow-x: hidden;
    height: 100vh;
  }

  #root {
    min-height: 100vh;
  }

  code {
    font-family: ${({ theme }) => theme.fontFamilyCode} !important;

    span {
      font-family: ${({ theme }) => theme.fontFamilyCode} !important;
    }
  }

  p {
    text-align: justify;
    word-wrap: break-word;
  }

  ::selection {
    color: #000;
    background: ${({ theme }) => theme.yellow9};

	  -webkit-text-fill-color: unset !important;
  }

  * {
	  box-sizing: border-box;
	  vertical-align: baseline;
  }

  @media only screen and (min-width: 574px) {
    * {
      ::-webkit-scrollbar {
        cursor: pointer;
        width: 4px;
        height: 4px;
        background-color: transparent;
      }

      ::-webkit-scrollbar-thumb {
        cursor: pointer;
        background-color: transparent;
        border-radius: 2px;
        transition: background-color 500ms ${({ theme }) => theme.motionEaseOut};

        &:hover {
          background-color: ${({ theme }) => theme.colorText};
        }
      }

      ::-webkit-scrollbar-corner {
        display: none;
        width: 0;
        height: 0;
      }

      &:hover {
        ::-webkit-scrollbar-thumb {
          background-color: ${({ theme }) => theme.colorFill};
        }
      }
    }
  }
`;

export default GlobalStyle;
