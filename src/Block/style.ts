import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, stylish, token }) => {
  return {
    borderless: stylish.variantBorderlessWithoutHover,
    clickableBorderless: stylish.variantBorderless,
    clickableFilled: stylish.variantFilled,
    clickableOutlined: stylish.variantOutlined,
    clickableRoot: css`
      cursor: pointer;
    `,
    filled: stylish.variantFilledWithoutHover,
    glass: stylish.blur,
    outlined: stylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;
      border-radius: ${token.borderRadius}px;
    `,
    shadow: stylish.shadow,
  };
});
