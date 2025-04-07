import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, css, stylish }, headerHeight: number) => {
  return {
    app: css`
      overflow: hidden auto;
      height: 100dvh;
    `,
    aside: css`
      position: sticky;
      z-index: 2;
      height: 100%;
    `,
    asideInner: css`
      overflow: hidden auto;
      width: 100%;
      height: calc(100dvh - ${headerHeight}px);
    `,
    content: css`
      position: relative;
      flex: 1;
      max-width: 100%;
    `,

    footer: css`
      position: relative;
      max-width: 100%;
    `,
    header: cx(
      stylish.blur,
      css`
        position: sticky;
        z-index: 999;
        inset-block-start: 0;
        max-width: 100%;
      `,
    ),
    main: css`
      position: relative;
      display: flex;
      align-items: stretch;
      max-width: 100vw;
    `,
    toc: css``,
  };
});
