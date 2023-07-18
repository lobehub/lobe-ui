import { createStyles } from 'antd-style';
import { isNumber } from 'lodash-es';

export const useStyles = createStyles(
  ({ css, cx, token, isDarkMode }, itemMinWidth?: string | number) => ({
    footer: css`
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `,
    formTitle: css`
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 6px;

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

      .ant-tag {
        font-family: ${token.fontFamilyCode};
      }
    `,
    group: cx(
      isDarkMode &&
        css`
          .ant-collapse-content {
            background: transparent;
          }

          .ant-collapse-header {
            background: ${token.colorFillTertiary};
          }
        `,
      css`
        .ant-collapse-header {
          border-radius: 0 !important;
        }

        .ant-collapse-content-box {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }

        .ant-form-item-label {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `,
    ),
    item: css`
      padding: 8px 0;

      .ant-row {
        justify-content: space-between;

        > div {
          flex: unset !important;
          flex-grow: unset !important;
        }
      }

      ${itemMinWidth &&
      css`
        .ant-form-item-control {
          width: ${isNumber(itemMinWidth) ? `${itemMinWidth}px` : itemMinWidth};
        }
      `}
    `,
    title: css`
      display: flex;
      gap: 8px;
      align-items: center;

      font-size: 16px;
      font-weight: 600;

      .anticon {
        color: ${token.colorPrimary};
      }
    `,
  }),
);
