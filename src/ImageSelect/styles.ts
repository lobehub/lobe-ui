import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ cx, stylish, css, token }) => {
  return {
    active: css`
      color: ${token.colorText};
    `,
    container: css`
      cursor: pointer;
      color: ${token.colorTextDescription};
    `,

    img: cx(
      stylish.variantFilled,
      css`
        border-radius: ${token.borderRadius}px;

        &:hover {
          box-shadow: 0 0 0 2px ${token.colorText};
        }
      `,
    ),
    imgActive: cx(
      stylish.active,
      css`
        box-shadow: 0 0 0 2px ${token.colorTextTertiary};
      `,
    ),
  };
});
