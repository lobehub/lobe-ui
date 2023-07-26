import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;

      line-height: 1;
      text-align: center;
    `,
    loading: css`
      position: absolute;
      inset: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;

      color: ${token.colorText};
    `,
  };
});
