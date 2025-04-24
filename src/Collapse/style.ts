import { createStyles } from 'antd-style';

export const DEFAULT_PADDING = '12px 16px';

export const getPadding = (padding?: number | string) =>
  !padding && padding !== 0 ? DEFAULT_PADDING : padding;

export const useStyles = createStyles(({ css, token, prefixCls, stylish }) => {
  return {
    borderless: css`
      &.${prefixCls}-collapse {
        .${prefixCls}-collapse-header {
          padding-inline: 0;
        }
        .${prefixCls}-collapse-content {
          padding-inline: 0;
          .${prefixCls}-collapse-content-box {
            padding-inline: 0;
          }
        }
      }
    `,
    desc: css`
      font-size: 12px;
      color: ${token.colorTextDescription};
    `,
    filled: css`
      &.${prefixCls}-collapse {
        .${prefixCls}-collapse-item {
          background: ${token.colorFillTertiary};
          .${prefixCls}-collapse-content {
            margin-inline: 3px;
            margin-block-end: 3px;
            background: ${token.colorBgContainer};
            border-radius: ${token.borderRadiusLG}px;
            ${stylish.variantOutlinedWithoutHover};
            ${stylish.shadow};
          }
        }
      }
    `,
    gapOutlined: css`
      &.${prefixCls}-collapse {
        background: transparent;
        .${prefixCls}-collapse-item {
          background: ${token.colorBgContainer};
          border: 1px solid ${token.colorFillSecondary};
        }

        .${prefixCls}-collapse-item:not(:first-child) {
          .${prefixCls}-collapse-header {
            border-block-start: none;
          }
        }
      }
    `,
    gapRoot: css`
      &.${prefixCls}-collapse {
        display: flex;
        flex-direction: column;
        border: none;
        box-shadow: none;
        .${prefixCls}-collapse-item {
          overflow: hidden;
          border: none;
          border-radius: ${token.borderRadiusLG}px;
        }
      }
    `,
    hideCollapsibleIcon: css`
      .${prefixCls}-collapse-expand-icon {
        display: none !important;
      }
    `,
    icon: css`
      cursor: pointer;
      transition: all 100ms ${token.motionEaseOut};
    `,
    outlined: css`
      &.${prefixCls}-collapse {
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorFillSecondary};
        .${prefixCls}-collapse-item .${prefixCls}-collapse-header {
          transition: none;
        }
        .${prefixCls}-collapse-item-active .${prefixCls}-collapse-header {
          border-block-end: 1px solid ${token.colorFillTertiary};
        }
        .${prefixCls}-collapse-item:not(:first-child) {
          .${prefixCls}-collapse-header {
            border-block-start: 1px solid ${token.colorFillTertiary};
          }
        }
      }
    `,
    root: css`
      &.${prefixCls}-collapse {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background: transparent;

        .${prefixCls}-collapse-header {
          display: flex;
          flex: none;
          gap: 0.75em;
          align-items: flex-start;

          border-radius: 0 !important;

          .${prefixCls}-collapse-expand-icon {
            align-items: center;
            min-height: 28px;
            padding: 0;
          }

          .${prefixCls}-collapse-extra {
            display: flex;
            align-items: center;
            min-height: 28px;
          }
        }

        .${prefixCls}-collapse-content {
          background: transparent;
        }
      }
    `,
    title: css`
      font-size: 16px;
      font-weight: 500;
      line-height: 28px;
    `,
  };
});
