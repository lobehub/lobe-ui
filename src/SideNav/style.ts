import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }) => css`
    width: 64px;
    height: 100%;
    min-height: 640px;
    padding-block: 16px;
    padding-inline: 0;

    background: ${token.colorBgContainer};
    border-inline-end: 1px solid ${token.colorBorderSecondary};
  `,
);
