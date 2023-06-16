import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, stylish, cx, token }, prefixCls: string) => ({
  button: cx(
    `${prefixCls}-button`,
    css`
      ${stylish.buttonDefaultHover}
      all: unset;

      cursor: default;
      user-select: none;

      padding: 8px;

      font-size: ${token.fontSize}px;
      line-height: 0;
      color: ${token.colorTextSecondary};

      background: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorder};
      border-radius: ${token.borderRadius}px;

      -webkit-tap-highlight-color: transparent;

      &:focus-visible {
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
      }
    `,
  ),
  container: cx(
    prefixCls,
    css`
      user-select: none;
      scrollbar-width: none;

      overflow-y: auto;
      overscroll-behavior: contain;

      box-sizing: border-box;
      width: 160px;
      padding: 5px;

      font-size: ${token.fontSize};

      background: ${token.colorBgElevated};
      border: 1px solid ${token.colorBorder};
      border-radius: 8px;
      outline: 0;
      box-shadow: ${token.boxShadowSecondary};

      &::-webkit-scrollbar {
        display: none;
      }
    `,
  ),
}));
