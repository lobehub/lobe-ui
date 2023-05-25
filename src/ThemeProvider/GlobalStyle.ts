import { createGlobalStyle } from 'antd-style';

const GlobalStyle = createGlobalStyle`

  html,body {
    --font-settings: "cv01";
    --font-variations: "opsz" auto;

    overflow-x: hidden;

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
    -webkit-tap-highlight-color: transparent;
  }


  * {
    box-sizing: border-box;
    vertical-align: baseline;
  }

  #root {
	  min-height: 100vh;
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 4px;
    background-color: transparent;

    &-thumb {
      background-color: ${({ theme }) => theme.colorFill};
      border-radius: 4px;
    }

    &-corner {
      display: none;
    }
  }

  p {
    text-align: justify;
    word-wrap: break-word;
  }
`;

export default GlobalStyle;
