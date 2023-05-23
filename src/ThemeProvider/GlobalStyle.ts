import { createGlobalStyle } from 'antd-style';

const GlobalStyle = createGlobalStyle`

  body {
    font-family: 'Segoe UI', SegoeUI, AliPuHui, ${({ theme }) => theme.fontFamily};
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

  @font-face {
    font-family: AliPuHui;
    font-weight: normal;
    src: url('//at.alicdn.com/t/webfont_exesdog9toj.woff2') format('woff2'),
    url('//at.alicdn.com/t/webfont_exesdog9toj.woff') format('woff'),
    url('//at.alicdn.com/t/webfont_exesdog9toj.ttf') format('truetype');
    font-display: swap;
  }

  @font-face {
    font-family: AliPuHui;
    font-weight: bold;
    src: url('https://at.alicdn.com/wf/webfont/exMpJIukiCms/Gsw2PSKrftc1yNWMNlXgw.woff2') format('woff2'),
    url('https://at.alicdn.com/wf/webfont/exMpJIukiCms/vtu73by4O2gEBcvBuLgeu.woff') format('woff');
    font-display: swap;
  }

  /* 定义滚动槽的样式 */
  ::-webkit-scrollbar {
    width: 0;
    height: 6px;
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
