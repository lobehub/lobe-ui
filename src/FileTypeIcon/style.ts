import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
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
