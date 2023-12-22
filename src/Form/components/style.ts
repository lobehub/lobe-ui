import { createStyles } from 'antd-style';
import { isNumber } from 'lodash-es';

export const useStyles = createStyles(
  ({ css, cx, token, isDarkMode, responsive, prefixCls }, itemMinWidth?: string | number) => ({
    formTitle: css`
      position: relative;
      text-align: left;

      > div {
        font-weight: 500;
        line-height: 1;
      }

      > small {
        display: block;

        line-height: 1;
        color: ${token.colorTextDescription};
        word-wrap: break-word;
        white-space: pre-wrap;
      }

      .${prefixCls}-tag {
        font-family: ${token.fontFamilyCode};
      }
    `,
    group: cx(
      isDarkMode &&
        css`
          .${prefixCls}-collapse-content {
            background: transparent;
          }

          .${prefixCls}-collapse-header {
            background: ${token.colorFillTertiary};
          }
        `,
      css`
        .${prefixCls}-collapse-header {
          align-items: center !important;
          border-radius: 0 !important;
        }

        .${prefixCls}-collapse-content-box {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }

        .${prefixCls}-form-item-label {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `,
    ),
    icon: css`
      transition: all 100ms ${token.motionEaseOut};
    `,
    item: css`
      padding: 16px 0;

      .${prefixCls}-row {
        justify-content: space-between;

        > div {
          flex: unset !important;
          flex-grow: unset !important;
        }
      }

      .${prefixCls}-form-item-required::before {
        align-self: flex-start;
      }

      ${itemMinWidth &&
      css`
        .${prefixCls}-form-item-control {
          width: ${isNumber(itemMinWidth) ? `${itemMinWidth}px` : itemMinWidth};
        }
      `}

      ${responsive.mobile} {
        padding: 16px 0;

        ${itemMinWidth
          ? css`
              .${prefixCls}-row {
                flex-direction: column;
                gap: 4px;
              }

              .${prefixCls}-form-item-control {
                flex: 1;
                width: 100%;
              }
            `
          : css`
              .${prefixCls}-row {
                flex-wrap: wrap;
                gap: 4px;
              }
            `}
      }
    `,
    itemNoDivider: css`
      &:not(:first-child) {
        padding-top: 0;
      }
    `,
    mobileGroupBody: css`
      padding: 0 16px;
      background: ${token.colorBgContainer};
    `,
    mobileGroupHeader: css`
      padding: 16px;
      background: ${token.colorBgLayout};
    `,
    title: css`
      align-items: center;
      font-size: 16px;
      font-weight: 600;

      .anticon {
        color: ${token.colorPrimary};
      }

      ${responsive.mobile} {
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
      }
    `,
  }),
);
