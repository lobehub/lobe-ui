import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, responsive, token }) => ({
  layout: css`
    background-color: ${token.colorBgLayout};
    background-image: linear-gradient(
      180deg,
      ${token.colorBgContainer} 0%,
      rgba(255, 255, 255, 0) 10%
    );

    height: 100vh;
    overflow: hidden;

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
  spacing: css`
    height: ${token.headerHeight + 16}px;
    ${responsive.mobile} {
      height: ${token.headerHeight + 32}px;
    }
  `,
  view: css`
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
  `,
  right: css`
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    flex: 1;
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
}));
