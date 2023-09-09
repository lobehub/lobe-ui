import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token, cx, stylish }) => {
  return {
    center: css`
      height: 100%;
    `,
    container: cx(
      stylish.blurStrong,
      css`
        overflow: hidden;
        flex: none;
        width: 100vw;
        background: linear-gradient(
          to bottom,
          ${rgba(token.colorBgLayout, 0.8)},
          ${rgba(token.colorBgLayout, 0.4)}
        );
      `,
    ),
    inner: css`
      position: relative;

      width: 100%;
      height: 44px;
      min-height: 44px;
      max-height: 44px;
      padding: 0 6px;
    `,
    left: css`
      justify-content: flex-start;
      height: 100%;
    `,
    right: css`
      justify-content: flex-end;
      height: 100%;
    `,
  };
});
