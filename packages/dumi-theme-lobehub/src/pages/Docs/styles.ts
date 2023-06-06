import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, responsive, token }) => ({
  layout: css`
    overflow: hidden;
    height: 100vh;
    background-color: ${token.colorBgLayout};
    background-image: linear-gradient(
      180deg,
      ${token.colorBgContainer} 0%,
      rgba(255, 255, 255, 0%) 10%
    );

    ${responsive.mobile} {
      display: flex;
      flex-direction: column;
    }
  `,

  toc: css`
    position: sticky;
    top: 100px;

    overflow: auto;
    overscroll-behavior: contain;

    width: ${token.tocWidth}px;
    max-height: 80vh;
    margin-top: 48px;
    margin-inline-end: 24px;

    -webkit-overflow-scrolling: touch;

    ${responsive.mobile} {
      z-index: 300;
      top: ${token.headerHeight + 1}px;
      width: 100%;
      margin-top: 0;
    }

    > h4 {
      margin: 0 0 8px;
      font-size: 12px;
      line-height: 1;
      color: ${token.colorTextDescription};
    }
  `,
  spacing: css`
    height: ${token.headerHeight + 16}px;
    ${responsive.mobile} {
      height: ${token.headerHeight + 32}px;
    }
  `,
  main: css`
    overflow: hidden;
    display: flex;
    width: 100%;
    height: 100vh;
  `,
  right: css`
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
    height: 100%;
  `,
  content: cx(
    css`
      width: 100%;
      max-width: 960px;
      margin: 0 24px;
    `,
    css(
      responsive({
        desktop: { maxWidth: token.contentMaxWidth },
        mobile: { margin: 0 },
      }),
    ),
  ),
}));
