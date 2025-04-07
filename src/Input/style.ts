import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, token, css, stylish }) => {
  return {
    borderless: cx(
      stylish.variantBorderless,
      css`
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
    filled: cx(
      stylish.variantFilled,
      css`
        &:focus-within {
          ${stylish.variantFilledWithoutHover}
        }
      `,
    ),
    outlined: cx(
      stylish.variantOutlined,
      css`
        &:focus-within {
          ${stylish.variantOutlinedWithoutHover}
        }
      `,
    ),
    root: css`
      &:focus-within {
        border-color: ${token.colorBorder};
      }
    `,
    shadow: stylish.shadow,
  };
});
