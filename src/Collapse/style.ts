import { createStyles } from 'antd-style';

export const DEFAULT_PADDING = '12px 16px';

export const getPadding = (padding?: number | string) =>
  !padding && padding !== 0 ? DEFAULT_PADDING : padding;

export const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    filled: css`
      &.${prefixCls}-collapse {
        .${prefixCls}-collapse-header {
          background: ${token.colorFillTertiary};
        }
        .${prefixCls}-collapse-item {
          background: ${token.colorFillQuaternary};
        }
      }
    `,
    gapOutlined: css`
      &.${prefixCls}-collapse {
        .${prefixCls}-collapse-item {
          box-shadow: 0 0 0 1px ${token.colorFillSecondary} inset;
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
        box-shadow: 0 0 0 1px ${token.colorFillTertiary} inset;
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
          align-items: center;

          border-radius: 0 !important;

          .${prefixCls}-collapse-expand-icon {
            padding: 0;
          }
        }

        .${prefixCls}-collapse-content {
          background: transparent;
        }
      }
    `,
  };
});
