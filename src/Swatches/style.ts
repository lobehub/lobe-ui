import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }, size: number) => {
  return {
    active: css`
      box-shadow: inset 0 0 0 2px ${token.colorPrimary};
    `,
    container: css`
      cursor: pointer;

      width: ${size}px;
      height: ${size}px;

      background: ${token.colorBgContainer};
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px ${token.colorFill};

      transition: scale 400ms ${token.motionEaseOut};

      &:active {
        scale: 0.8;
      }
    `,
  };
});
