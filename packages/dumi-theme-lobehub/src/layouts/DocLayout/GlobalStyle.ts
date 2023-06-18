import { createGlobalStyle } from 'antd-style';

const GlobalStyle = createGlobalStyle`

#nprogress {
  .bar {
    z-index: 9999;
    background: ${({ theme }) => theme.colorText};
  }


  .peg {
    box-shadow: none;
  }

  .spinner {
    display: none;
  }
}




`;

export default GlobalStyle;
