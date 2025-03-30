import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls }, size: number) => {
  return {
    active: css`
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 20%);
    `,
    conic: css`
      background: conic-gradient(
        ${token.red},
        ${token.volcano},
        ${token.orange},
        ${token.gold},
        ${token.yellow},
        ${token.lime},
        ${token.green},
        ${token.cyan},
        ${token.blue},
        ${token.geekblue},
        ${token.purple},
        ${token.magenta},
        ${token.red}
      );
      .${prefixCls}-color-picker-color-block {
        opacity: 0;
      }
    `,

    container: css`
      cursor: pointer;

      flex: none;

      width: ${size}px;
      min-width: ${size}px;
      height: ${size}px;
      min-height: ${size}px;

      background: ${token.colorBgContainer};
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 5%);

      &:hover {
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 5%),
          0 0 0 2px ${token.colorText};
      }
    `,

    picker: css`
      overflow: hidden;
      flex: none;

      width: ${size}px;
      min-width: ${size}px;
      height: ${size}px;
      min-height: ${size}px;
      padding: 0;

      border: none;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 5%);

      &:hover {
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 5%),
          0 0 0 2px ${token.colorText};
      }

      .${prefixCls}-color-picker-color-block {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: inherit;
      }
    `,
  };
});
