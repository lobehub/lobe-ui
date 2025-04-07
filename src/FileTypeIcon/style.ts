import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;
    `,
    icon: css`
      position: relative;
      flex: none;
      line-height: 1;
    `,
    inner: css`
      position: absolute;
      z-index: 1;
    `,
  };
});
