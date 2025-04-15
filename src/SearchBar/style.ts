import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish, cx }) => ({
  icon: css`
    color: ${token.colorTextPlaceholder};
  `,
  search: css`
    position: relative;
    max-width: 100%;
  `,
  tag: cx(
    stylish.blur,
    css`
      position: absolute;
      inset-block-start: 50%;
      inset-inline-end: 6px;
      transform: translateY(-50%);

      color: ${token.colorTextDescription};

      kbd {
        color: inherit;
      }
    `,
  ),
}));
