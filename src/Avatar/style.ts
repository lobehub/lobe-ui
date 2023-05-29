import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    cursor: pointer;

    > * {
      cursor: pointer;
    }
  `,
  border: css`
    border: 1px solid ${token.colorBorder};
  `,
}));
