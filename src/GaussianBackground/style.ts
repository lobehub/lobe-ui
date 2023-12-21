import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  canvas: css`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  `,
  container: css`
    position: relative;
    width: 100%;
    height: 100%;
  `,
  content: css`
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  `,
}));
