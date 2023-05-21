import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, cx, responsive, token },
    { hideToc, hideSidebar }: { hideToc: boolean; hideSidebar: boolean },
  ) => ({
    layout: css`
      background-color: ${token.colorBgLayout};
      background-image: linear-gradient(
        180deg,
        ${token.colorBgContainer} 0%,
        rgba(255, 255, 255, 0) 10%
      );
      display: grid;
      grid-template-columns: ${token.sidebarWidth}px 1fr ${hideToc
          ? ''
          : `${token.tocWidth + 24}px`};
      grid-template-rows: ${token.headerHeight}px auto 1fr auto;
      grid-template-areas:
        'head head head'
        '${hideSidebar ? 'title' : 'sidebar'} title ${hideToc ? 'title' : '.'}'
        '${hideSidebar ? 'main' : 'sidebar'} main ${hideToc ? 'main' : 'toc'}'
        '${hideSidebar ? 'footer' : 'sidebar'} footer footer';
      min-height: 100vh;

      ${responsive.mobile} {
        display: flex;
        flex-direction: column;
      }
    `,

    toc: css`
      position: sticky;
      top: 100px;
      width: ${token.tocWidth}px;
      margin-inline-end: 24px;
      max-height: 80vh;
      overflow: auto;
      margin-top: 48px;

      ${responsive.mobile} {
        z-index: 300;
        top: ${token.headerHeight + 1}px;
        margin-top: 0;
        width: 100%;
      }

      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;

      > h4 {
        margin: 0 0 8px;
        color: ${token.colorTextDescription};
        font-size: 12px;
        line-height: 1;
      }
    `,

    content: cx(
      css`
        max-width: 960px;
        width: 100%;
        margin: 0 24px;
      `,
      css(
        responsive({
          desktop: { maxWidth: token.contentMaxWidth },
          mobile: { margin: 0 },
        }),
      ),
    ),
  }),
);
