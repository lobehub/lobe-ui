import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    bottom: css`
      padding-block-end: env(safe-area-inset-bottom);
    `,
    container: css`
      overflow: hidden;
      flex: none;
      width: 100vw;
    `,
    top: css`
      padding-block-start: env(safe-area-inset-top);
    `,
  };
});
