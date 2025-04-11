import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish }) => {
  return {
    borderless: stylish.variantBorderless,
    disabled: stylish.disabled,
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
