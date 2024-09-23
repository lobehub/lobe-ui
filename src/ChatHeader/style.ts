import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token }) => {
  return {
    center: css`
      position: relative;
      overflow: hidden;
    `,
    container: css`
      position: absolute;
      z-index: 10;

      overflow: hidden;
      grid-area: header;
      align-self: stretch;

      width: 100%;
      height: 64px;

      background: linear-gradient(
        to bottom,
        ${rgba(token.colorBgLayout, 0.8)},
        ${rgba(token.colorBgLayout, 0.4)}
      );
      border-block-end: 1px solid ${token.colorBorder};
    `,
    left: css`
      position: relative;
      overflow: hidden;
      flex: 1;
    `,
    right: css`
      position: relative;
      overflow: hidden;
      flex: none;
    `,
  };
});
