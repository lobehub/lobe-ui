import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ token, stylish, prefixCls, responsive, cx, css }) => {
  const fixHeight = 36;
  return {
    container: css`
      position: fixed;
      z-index: 10;
      top: ${token.headerHeight + 64}px;
      right: 0;

      overflow: auto;
      overscroll-behavior: contain;
      grid-area: toc;

      width: ${token.tocWidth}px;
      max-height: 80vh;
      margin-inline-end: 24px;

      border-radius: 3px;

      -webkit-overflow-scrolling: touch;

      ${responsive.mobile} {
        z-index: 300;
        top: ${token.headerHeight + 1}px;
        width: 100%;
        margin-top: 0;
      }

      > h4 {
        margin: 0 0 8px;
        font-size: 12px;
        line-height: 1;
        color: ${token.colorTextDescription};
      }
    `,
    mobileCtn: css`
      position: fixed;
      z-index: 200;
      top: ${token.headerHeight}px;

      width: 100%;
      height: ${fixHeight}px;
      .ant-collapse-expand-icon {
        color: ${token.colorTextQuaternary};
      }
    `,
    expand: cx(
      stylish.blur,
      css`
        z-index: 201;

        width: 100%;

        background-color: ${rgba(token.colorBgLayout, 0.8)};
        border-bottom: 1px solid ${token.colorSplit};
        border-radius: 0;
        box-shadow: ${token.boxShadowSecondary};

        .${prefixCls}-collapse-header {
          padding: 8px 16px !important;
        }
      `,
    ),
    anchor: css`
      ${stylish.blur}
    `,
  };
});
