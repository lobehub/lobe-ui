import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;
      line-height: 1;
      text-align: center;
    `,
  };
});
