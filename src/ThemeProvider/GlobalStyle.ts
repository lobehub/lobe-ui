import { createGlobalStyle } from 'antd-style';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${({ theme }) => theme.fontFamily};
    font-size: ${({ theme }) => theme.fontSize};
    line-height: 1;
    color: ${({ theme }) => theme.colorTextBase};

    background: ${({ theme }) => theme.colorBgBase};

  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
