import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, token, css, stylish, prefixCls }) => {
  return {
    borderless: css`
      &.${prefixCls}-input {
        ${stylish.variantBorderless}
        &:hover {
          ${stylish.variantBorderlessWithoutHover}
        }
      }
    `,
    borderlessOPT: css`
      &.${prefixCls}-otp {
        .${prefixCls}-otp-input {
          ${stylish.variantBorderless};
        }
      }
    `,
    filled: cx(
      stylish.variantFilled,
      css`
        &:focus-within {
          ${stylish.variantFilledWithoutHover}
        }
      `,
    ),

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
