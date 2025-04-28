import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, stylish }) => {
  return {
    borderless: stylish.variantBorderless,
    filled: stylish.variantFilled,
    outlined: stylish.variantOutlined,
    root: css``,
    shadow: stylish.shadow,
  };
});
