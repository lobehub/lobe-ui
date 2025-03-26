import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }, size: number) => {
  return {
    active: css`
      box-shadow:
        inset 0 0 0 1px rgba(0, 0, 0, 20%),
        0 0 0 2px ${token.colorTextTertiary};
    `,
    container: css`
      cursor: pointer;

      width: ${size}px;
      height: ${size}px;

      background: ${token.colorBgContainer};
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 5%);

      &:hover {
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 5%),
          0 0 0 2px ${token.colorText};
      }
    `,
  };
});
