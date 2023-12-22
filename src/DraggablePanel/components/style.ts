import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  body: css`
    overflow-x: hidden;
    overflow-y: auto;
    padding: 16px;
  `,
  container: css`
    position: relative;
    overflow: hidden;
  `,
  footer: css`
    padding: 8px 16px;
    border-top: 1px solid ${token.colorBorderSecondary};
  `,
  header: css`
    padding: 8px 16px;
    font-weight: 500;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
}));
