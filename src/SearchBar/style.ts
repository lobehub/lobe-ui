import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, stylish, cx }) => ({
  icon: css`
    color: ${token.colorTextPlaceholder};
  `,
  input: css`
    position: relative;
    padding: 0 8px 0 12px;
  `,
  search: css`
    position: relative;
    max-width: 100%;
  `,

  tag: cx(
    stylish.blur,
    css`
      pointer-events: none;

      position: absolute;
      z-index: 5;
      inset-block-start: 50%;
      inset-inline-end: 12px;
      transform: translateY(-50%);

      color: ${token.colorTextDescription};
    `,
  ),
}));
