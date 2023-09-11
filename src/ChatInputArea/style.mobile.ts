import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      padding: 12px 0;
    `,
    inner: css`
      padding: 0 16px;
    `,
    input: css`
      background: ${token.colorFillSecondary} !important;
      border: none !important;
    `,
  };
});
