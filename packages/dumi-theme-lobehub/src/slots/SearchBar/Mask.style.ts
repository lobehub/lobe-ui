import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => {
  return {
    modal: css`
      position: fixed;
      z-index: 1000;
      top: 0;
      inset-inline-start: 0;

      display: flex;
      justify-content: center;

      width: 100vw;
      height: 100vh;
    `,
    mask: css`
      width: 100%;
      height: 100%;
      background-color: ${token.colorBgMask};
    `,
    content: css`
      position: absolute;
      top: 60px;

      display: flex;
      flex-direction: column;

      box-sizing: border-box;
      width: 500px;
      max-height: calc(100% - 120px);
      padding: 12px;

      background-color: ${token.colorBgElevated};
      border-radius: 8px;
      box-shadow: inset 1px 1px 0 0 hsla(0deg, 0%, 100%, 50%), 0 3px 8px 0 #555a64;
    `,
  };
});
