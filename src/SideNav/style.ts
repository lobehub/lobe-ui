import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }) => css`
    width: 58px;
    height: 100%;
    min-height: 640px;
    padding-block: 12px;
    padding-inline: 0;
    border-inline-end: 1px solid ${token.colorBorderSecondary};

    background: ${token.colorBgContainer};
  `,
);
