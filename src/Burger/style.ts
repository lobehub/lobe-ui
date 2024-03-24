import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  (
    { token, css, stylish, prefixCls },
    { fullscreen, headerHeight }: { fullscreen?: boolean; headerHeight: number },
  ) => {
    return {
      container: css`
        cursor: pointer;
        width: ${token.controlHeight}px;
        height: ${token.controlHeight}px;
        border-radius: ${token.borderRadius}px;
      `,
      drawer: css`
        &.${prefixCls}-drawer-content {
          background: transparent;
        }

        .${prefixCls}-drawer-body {
          display: flex;
          flex-direction: column;
        }
      `,
      drawerRoot: css`
        inset-block-start: ${fullscreen ? 0 : headerHeight + 1}px;

        :focus-visible {
          outline: none;
        }

        .${prefixCls}-drawer {
          &-mask {
            ${stylish.blur};
            background-color: ${rgba(token.colorBgLayout, 0.5)};
          }

          &-content-wrapper {
            box-shadow: none;
          }
        }
      `,

      fillRect: css`
        flex: 1;
        width: 100%;
        border-block-start: none;
      `,

      menu: css`
        padding-block-start: ${fullscreen ? headerHeight : 0}px;
        background: transparent;
        border-inline-end: transparent !important;

        > .${prefixCls}-menu-item-only-child, .${prefixCls}-menu-submenu-title {
          width: 100%;
          margin: 0 !important;
          border-block-start: none;
          border-radius: 0;

          &:active {
            color: ${token.colorText};
            background-color: ${token.colorFill};
          }
        }

        .${prefixCls}-menu-item-only-child:first-child {
          border-block-start: none;
        }

        .${prefixCls}-menu-submenu-title[aria-expanded='true'] {
          a {
            font-weight: 600;
            color: ${token.colorText} !important;
          }
        }

        .${prefixCls}-menu-item-group-title {
          padding-block: 8px;

          font-size: 12px;
          font-weight: 500;
          line-height: 1;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;

          background: ${token.colorFillSecondary};
        }

        .${prefixCls}-menu-item {
          width: calc(100% - 16px) !important;
          margin: 8px !important;
          border-radius: ${token.borderRadius}px;

          &:hover,
          &:active {
            color: ${token.colorText} !important;
            background: ${token.colorFillSecondary} !important;
          }
        }

        .${prefixCls}-menu-item-active {
          width: calc(100% - 16px) !important;
          margin: 8px !important;
          background: ${token.colorFillSecondary};
          border-radius: ${token.borderRadius}px;
        }

        .${prefixCls}-menu-item-selected {
          font-weight: 600;
          color: ${token.colorBgLayout};
          background: ${token.colorText};

          &:hover,
          &:active {
            color: ${token.colorBgLayout} !important;
            background: ${token.colorText} !important;
          }
        }
      `,
    };
  },
);
