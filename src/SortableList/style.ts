import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, stylish, token }) => {
  return {
    borderless: stylish.variantBorderlessWithoutHover,
    container: css`
      padding: 0;
      list-style: none;
    `,
    filled: stylish.variantFilledWithoutHover,
    item: css`
      overflow: hidden;
      box-sizing: border-box;
      list-style: none;
      border-radius: ${token.borderRadius}px;
    `,
    itemVariant: css`
      padding-block: 4px;
      padding-inline: 4px 16px;
    `,
    outlined: stylish.variantOutlinedWithoutHover,
  };
});
