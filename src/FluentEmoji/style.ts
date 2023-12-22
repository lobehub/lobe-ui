import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;

      line-height: 1;
      text-align: center;
    `,
  };
});
