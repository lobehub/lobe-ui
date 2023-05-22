import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }, active) => {
  return {
    block: css`
      cursor: pointer;

      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;

      color: ${active ? token.colorText : token.colorTextQuaternary};

      background: ${active ? token.colorFill : 'transparent'};

      transition: color 600ms ${token.motionEaseOut}, background-color 100ms ${token.motionEaseOut};

      &:hover {
        color: ${token.colorText};
        background-color: ${token.colorFillTertiary};
      }

      &:active {
        color: ${token.colorText};
        background-color: ${token.colorFill};
      }
    `,
  };
});
