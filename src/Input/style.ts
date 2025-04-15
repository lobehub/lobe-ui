import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css, stylish, prefixCls }) => {
  return {
    borderless: stylish.variantBorderless,
    borderlessOPT: css`
      &.${prefixCls}-otp {
        .${prefixCls}-otp-input {
          ${stylish.variantBorderless};
        }
      }
    `,
    filled: stylish.variantFilled,

    filledOPT: css`
      &.${prefixCls}-otp {
        .${prefixCls}-otp-input {
          ${stylish.variantFilled};
        }
      }
    `,
    outlined: stylish.variantOutlined,
    outlinedOPT: css`
      &.${prefixCls}-otp {
        .${prefixCls}-otp-input {
          ${stylish.variantOutlined};
        }
      }
    `,
    root: css`
      overflow: hidden;
    `,
    rootOPT: css`
      &.${prefixCls}-otp {
        .${prefixCls}-otp-input {
          &:focus-within {
            border-color: ${token.colorBorder};
          }
        }
      }
    `,
    shadow: stylish.shadow,
    shadowOPT: css`
      &.${prefixCls}-otp {
        .${prefixCls}-otp-input {
          ${stylish.shadow};
        }
      }
    `,
  };
});
