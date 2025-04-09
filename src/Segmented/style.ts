import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, stylish }) => {
  return {
    borderless: stylish.variantBorderlessWithoutHover,
    filled: stylish.variantFilledWithoutHover,
    glass: stylish.blur,
    outlined: stylish.variantOutlinedWithoutHover,
    root: css``,
    shadow: stylish.shadow,
  };
});
