import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, cx, token, isDarkMode, prefixCls },
    {
      isSplit,
      bodyPadding = '12px 16px',
      headerPadding = '12px 16px',
    }: { bodyPadding?: number | string; headerPadding?: number | string; isSplit?: boolean },
  ) => {
    const pureStyle = css`
      background: transparent;
      border-radius: 0;

      .${prefixCls}-collapse-header {
        padding-inline: 0 !important;
        background: transparent !important;
      }

      .${prefixCls}-collapse-content {
        background: transparent;
        border-color: ${token.colorFillSecondary};
      }

      .${prefixCls}-collapse-content-box {
        padding-inline: 2px !important;
        background: transparent;
        border-radius: 0;
      }
    `;

    const blockStyle = cx(
      css`
        background: transparent !important;
        .${prefixCls}-collapse-item {
          background: ${token.colorFillQuaternary} !important;
        }

        .${prefixCls}-collapse-header {
          background: ${token.colorFillTertiary} !important;
        }
      `,
      isSplit
        ? css`
            .${prefixCls}-collapse-item {
              overflow: hidden;
              border-radius: ${token.borderRadiusLG}px !important;
            }
          `
        : css`
            border-radius: ${token.borderRadiusLG}px;
          `,
    );
    const ghostStyle = cx(
      css`
        background: transparent;

        .${prefixCls}-collapse-header {
          background: transparent !important;
        }

        .${prefixCls}-collapse-content-box {
          background: transparent;
        }
      `,
      isSplit
        ? css`
            .${prefixCls}-collapse-item {
              overflow: hidden;
              border: 1px solid ${token.colorBorderSecondary} !important;
              border-radius: ${token.borderRadiusLG}px !important;
              &.${prefixCls}-collapse-item-active {
                .${prefixCls}-collapse-content-box {
                  border-block-start: 1px solid ${token.colorBorderSecondary} !important;
                }
              }
            }
          `
        : css`
            .${prefixCls}-collapse-item:not(:first-child) {
              .${prefixCls}-collapse-header {
                border-block-start: 1px solid ${token.colorBorderSecondary};
              }
            }
          `,
    );

    const defaultStyle = cx(
      css`
        background: transparent !important;
        .${prefixCls}-collapse-item {
          background: transparent !important;
        }

        .${prefixCls}-collapse-header {
          background: ${token.colorFillTertiary} !important;
        }
      `,
      isSplit
        ? css`
            background: transparent;
            .${prefixCls}-collapse-item {
              overflow: hidden;
              border: 1px solid ${token.colorBorderSecondary} !important;
              border-radius: ${token.borderRadiusLG}px !important;
            }
          `
        : css`
            border-radius: ${token.borderRadiusLG}px;
            .${prefixCls}-collapse-item:not(:first-child) {
              .${prefixCls}-collapse-header {
                border-block-start: 1px solid ${token.colorBorderSecondary};
              }
            }
          `,
    );

    return {
      blockStyle,
      defaultStyle,
      flatGroup: css`
        overflow: hidden;
        padding-inline: 16px;
      `,
      ghostStyle,
      group: cx(
        isDarkMode &&
          css`
            .${prefixCls}-collapse-content {
              background: transparent;
              border-color: ${token.colorBorderSecondary};
            }

            .${prefixCls}-collapse-header {
              background: ${token.colorFillTertiary};
            }
          `,
        css`
          overflow: hidden;
          display: flex;
          flex: none;
          flex-direction: column;

          .${prefixCls}-collapse-item {
            border: none;
          }

          .${prefixCls}-collapse-extra {
            margin-inline-start: 16px;
          }

          .${prefixCls}-collapse-header {
            align-items: center !important;
            padding: ${typeof headerPadding === 'string'
              ? headerPadding
              : `${headerPadding}px`} !important;
            border-radius: 0 !important;
          }

          .${prefixCls}-collapse-content-box {
            padding: ${typeof bodyPadding === 'string'
              ? bodyPadding
              : `${bodyPadding}px`} !important;
          }

          .${prefixCls}-form-item-label {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        `,
      ),
      hideCollapsibleIcon: css`
        .${prefixCls}-collapse-expand-icon {
          display: none !important;
        }
      `,

      icon: css`
        transition: all 100ms ${token.motionEaseOut};
      `,
      pureStyle,
    };
  },
);
