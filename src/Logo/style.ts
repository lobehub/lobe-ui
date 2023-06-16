import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    extraTitle: css`
      font-weight: 300;
      white-space: nowrap;
    `,
    flexCenter: css`
      display: flex;
      align-items: center;
    `,
  };
});
