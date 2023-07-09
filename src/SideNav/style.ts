import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }) => css`
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    width: 64px;
    height: 100%;
    min-height: 640px;
    padding: 16px 0;

    background: ${token.colorBgContainer};
    border-right: 1px solid ${token.colorBorder};
  `,
);
