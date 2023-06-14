import { createGlobalStyle } from 'antd-style';

const GlobalStyle = createGlobalStyle`

  html,body {
    --font-settings: "cv01", "tnum", "kern";
    --font-variations: "opsz" auto, tabular-nums;

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

  body {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100vh;
  }


  * {
	  box-sizing: border-box;
	  vertical-align: baseline;
  }

  ::selection {
    color: #000;
    background: ${({ theme }) => theme.yellow9};
  }


  #root {
	  min-height: 100vh;
  }

  p {
    text-align: justify;
    word-wrap: break-word;
  }

  code {
	  font-family: ${({ theme }) => theme.fontFamilyCode} !important;

	  * {
		  font-family: inherit !important;
	  }
  }
`;

export default GlobalStyle;
