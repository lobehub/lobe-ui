import { ThemeProvider } from '@/index';
import { createGlobalStyle } from 'antd-style';
import { useOutlet, usePrefersColor } from 'dumi';
import React from 'react';

const GlobalStyle = createGlobalStyle`
  #root {
    .main-menu-inner {
      height: 100vh;
    }
    [class$="-mainWrap"] {
      margin-top: unset;
    }
    [class$="-articleWrapper"] {
      padding-top: 40px;

    }
    [class$="-header"] {
      background: ${({ theme }) => theme.colorBgBase};
      * {
        background: ${({ theme }) => theme.colorBgBase};
      }
    }
    [class$="-footer"] {
      background: ${({ theme }) => theme.colorBgContainer};
      border-top: 1px solid ${({ theme }) => theme.colorBorder};
    }

    .dumi-default-previewer,.dumi-default-previewer-meta {
      background: ${({ theme }) => theme.colorBgBase};
      border-color: ${({ theme }) => theme.colorBorder};
      border-radius: 0;
    }
    .dumi-default-previewer-demo{
      padding: 16px;
    }
    .site-mask {
      background: none !important;
    }
  }


`;

const GlobalLayout: React.FC = () => {
  const [color] = usePrefersColor();
  const outlet = useOutlet();
  return (
    <ThemeProvider appearance={color}>
      <GlobalStyle />
      {outlet}
    </ThemeProvider>
  );
};

export default GlobalLayout;
