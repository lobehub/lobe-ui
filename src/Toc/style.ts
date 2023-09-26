import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  (
    { token, stylish, responsive, cx, css, prefixCls },
    { tocWidth, headerHeight }: { headerHeight: number; tocWidth: number },
  ) => {
    const fixHeight = 36;

    return {
      anchor: cx(
        stylish.blur,
        css`
          overflow-x: hidden;
          overflow-y: auto;
          max-height: 60vh !important;
        `,
      ),
      container: css`
        position: sticky;
        top: ${headerHeight + 64}px;

        overscroll-behavior: contain;
        grid-area: toc;

        width: ${tocWidth}px;
        margin-inline-end: 24px;

        border-radius: 3px;

        -webkit-overflow-scrolling: touch;

        ${responsive.mobile} {
          position: relative;
          left: 0;
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
      expand: cx(
        stylish.blur,
        css`
          width: 100%;

          background-color: ${rgba(token.colorBgLayout, 0.5)};
          border-bottom: 1px solid ${token.colorSplit};
          border-radius: 0;
          box-shadow: ${token.boxShadowSecondary};

          .${prefixCls}-collapse-content {
            overflow: auto;
          }

          .${prefixCls}-collapse-header {
            z-index: 10;
            padding: 8px 16px !important;
          }
        `,
      ),
      mobileCtn: css`
        width: 100%;
        height: ${fixHeight}px;

        .${prefixCls}-collapse-expand-icon {
          color: ${token.colorTextQuaternary};
        }
      `,
    };
  },
);
