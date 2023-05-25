import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    flexCenter: css`
      display: flex;
      align-items: center;
    `,
    extraTitle: css`
      font-weight: 300;
      white-space: nowrap;
    `,
  };
});
