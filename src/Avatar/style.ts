import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ stylish, css, token, prefixCls }) => {
  return {
    borderless: stylish.variantBorderlessWithoutHover,
    filled: stylish.variantFilledWithoutHover,
    loading: css`
      position: absolute;
      color: #fff;
      background: ${token.colorBgMask};
    `,
    outlined: stylish.variantOutlinedWithoutHover,
    root: css`
      background: transparent;
      &.${prefixCls}-avatar {
        user-select: none;

        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        border: none;

        .${prefixCls}-avatar-string {
          transform: none !important;

          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;
          padding: 0;

          font-size: inherit;
          font-weight: bolder;
          line-height: 1;
          color: inherit;
        }
      }
    `,
    shadow: stylish.shadow,
  };
});
