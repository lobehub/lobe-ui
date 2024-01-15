import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      padding: 0;
      list-style: none;
    `,
    item: css`
      box-sizing: border-box;
      list-style: none;
    `,
  };
});
