import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }, size: number) => {
  return {
    active: css`
      box-shadow: 0 0 0 2px ${token.colorTextTertiary};
    `,
    container: css`
      cursor: pointer;

      width: ${size}px;
      height: ${size}px;

      background: ${token.colorBgContainer};
      border-radius: 50%;
      box-shadow: inset 0 0 0 2px ${token.colorSplit};

      transition:
        scale 400ms ${token.motionEaseOut},
        box-shadow 100ms ${token.motionEaseOut};

      &:hover {
        box-shadow: 0 0 0 3px ${token.colorText};
      }

      &:active {
        scale: 0.8;
      }
    `,
  };
});
