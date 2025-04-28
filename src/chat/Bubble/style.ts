import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, css, stylish, token }) => {
  return {
    borderless: stylish.variantBorderlessWithoutHover,
    filled: cx(
      stylish.variantFilledWithoutHover,
      css`
        background: ${token.colorBgContainer};
      `,
    ),
    outlined: stylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;
      border-radius: ${token.borderRadius}px;
    `,
    shadow: stylish.shadow,
  };
});
