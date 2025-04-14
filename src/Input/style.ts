import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, token, css, stylish, prefixCls }) => {
  return {
    borderless: cx(
      stylish.variantBorderless,
      css`
        padding: 0;

        &:hover {
          ${stylish.variantBorderlessWithoutHover}
        }

        &:active {
          ${stylish.variantBorderlessWithoutHover}
        }

        &:focus-within {
          ${stylish.variantBorderlessWithoutHover}
        }
      `,
    ),
    borderlessOPT: css`
      &.${prefixCls}-otp {
        .${prefixCls}-otp-input {
          ${stylish.variantBorderless};
          &:hover {
            ${stylish.variantBorderlessWithoutHover}
          }

          &:active {
            ${stylish.variantBorderlessWithoutHover}
          }

          &:focus-within {
            ${stylish.variantBorderlessWithoutHover}
          }
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
          &:focus-within {
            ${stylish.variantFilledWithoutHover};
          }
        }
      }
    `,
    outlined: cx(
      stylish.variantOutlined,
      css`
        &:focus-within {
          ${stylish.variantOutlinedWithoutHover}
        }
      `,
    ),
    outlinedOPT: css`
      &.${prefixCls}-otp {
        .${prefixCls}-otp-input {
          ${stylish.variantOutlined};
          &:focus-within {
            ${stylish.variantFilledWithoutHover}
          }
        }
      }
    `,
    root: css`
      overflow: hidden;
      border: none;

      &:focus-within {
        border-color: ${token.colorBorder};
      }
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
          &:focus-within {
            ${stylish.shadow};
          }
        }
      }
    `,
  };
});
