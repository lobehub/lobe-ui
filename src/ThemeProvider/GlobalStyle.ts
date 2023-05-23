import { createGlobalStyle } from 'antd-style';

const GlobalStyle = createGlobalStyle`

  body {
    font-family: ${({ theme }) => theme.fontFamily};
    font-size: ${({ theme }) => theme.fontSize}px;
    line-height: 1;
    color: ${({ theme }) => theme.colorTextBase};

    margin: 0;
    padding: 0;
    background-color: ${(p) => p.theme.colorBgLayout};

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  #root {
	  min-height: 100vh;
  }
  /* 定义滚动槽的样式 */
  ::-webkit-scrollbar {
    width: 0;
    height: 4px;
    margin-right: 4px;
    background-color: transparent; // 定义滚动槽的背景色

    &-thumb {
      background-color: ${({ theme }) => theme.colorFill}; // 定义滚动块的背景色
      border-radius: 4px; // 定义滚动块的圆角半径
    }

    &-corner {
      display: none;
    }
  }
`;

export default GlobalStyle;
