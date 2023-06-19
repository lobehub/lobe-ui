import { createGlobalStyle } from 'antd-style';

const GlobalStyle = createGlobalStyle`

#nprogress {
  .bar {
    background: ${({ theme }) => theme.colorText};
  }
	
  .peg {
	  display: none !important;
  }

  .spinner {
    display: none;
  }
}




`;

export default GlobalStyle;
