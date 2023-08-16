import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    bottom: css`
      padding-bottom: env(safe-area-inset-bottom);
    `,
    container: css`
      overflow: hidden;
      flex: 0;
      width: 100vw;
    `,
    top: css`
      padding-top: env(safe-area-inset-top);
    `,
  };
});
