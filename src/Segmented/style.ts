import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, stylish, token }) => {
  return {
    borderless: stylish.variantBorderlessWithoutHover,
    filled: css`
      background: ${token.colorBgLayout};
      border: 1px solid ${token.colorFillQuaternary};
    `,
    glass: stylish.blur,
    outlined: css`
      background: transparent;
      border: 1px solid ${token.colorBorderSecondary};
    `,
    root: css``,
    shadow: stylish.shadow,
  };
});
