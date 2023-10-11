import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    center: css`
      height: 100%;
    `,
    container: css`
      overflow: hidden;
      flex: none;
      width: 100vw;
      background: ${token.colorBgLayout};
    `,

    inner: css`
      position: relative;

      width: 100%;
      height: 44px;
      min-height: 44px;
      max-height: 44px;
      padding: 0 6px;
    `,
    left: css`
      justify-content: flex-start;
      height: 100%;
    `,
    right: css`
      justify-content: flex-end;
      height: 100%;
    `,
  };
});
