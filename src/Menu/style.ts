import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, token }, prefixCls: string) => ({
  container: cx(
    prefixCls,
    css`
      user-select: none;
      scrollbar-width: none;

      overflow-y: auto;
      overscroll-behavior: contain;

      box-sizing: border-box;
      width: 200px;
      padding: 5px;

      font-size: ${token.fontSize};

      background: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorder};
      border-radius: 8px;
      outline: 0;
      box-shadow: ${token.boxShadowSecondary};

      &::-webkit-scrollbar {
        display: none;
      }
    `,
  ),
  button: cx(
    `${prefixCls}-button`,
    css`
      all: unset;

      cursor: default;
      user-select: none;

      padding: 12px 10px;

      font-size: ${token.fontSize}px;
      line-height: 1;
      color: ${token.colorText};

      background: ${token.colorBgContainer};
      border: 1px solid ${token.colorBorder};
      border-radius: ${token.borderRadius}px;

      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: ${token.colorPrimaryBg};
        border-color: transparent;
      }

      &:focus-visible {
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
      }
    `,
  ),
}));
