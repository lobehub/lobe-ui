import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => {
  return {
    actionBar: css`
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;

      height: 36px;
    `,
    tabs: css`
      padding: 0 12px;
      background: ${token.colorBgLayout};
      border-top: 1px dashed ${token.colorBorderSecondary};
      border-bottom: 1px dashed ${token.colorBorderSecondary};
    `,
  };
});
