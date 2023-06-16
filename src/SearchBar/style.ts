import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
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

  tag: css`
    pointer-events: none;

    position: absolute;
    z-index: 5;
    top: 50%;
    right: 0;
    transform: translateY(-50%);

    background: ${token.colorBgContainer};
  `,
}));
