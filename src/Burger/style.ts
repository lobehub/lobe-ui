import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ token, css, stylish }, headerHeight: number) => {
  return {
    container: css`
      cursor: pointer;
      width: ${token.controlHeight}px;
      height: ${token.controlHeight}px;
      border-radius: ${token.borderRadius}px;
    `,
    drawer: css`
      &.ant-drawer-content {
        background: transparent;
      }

      .ant-drawer-body {
        display: flex;
        flex-direction: column;
      }
    `,
    drawerRoot: css`
      top: ${headerHeight + 1}px;

      :focus-visible {
        outline: none;
      }

      .ant-drawer {
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
      border-top: none;
    `,

    menu: css`
      background: transparent;
      border-inline-end: transparent !important;

      > .ant-menu-item-only-child,
      .ant-menu-submenu-title {
        width: 100%;
        margin: 0 !important;
        border-top: none;
        border-radius: 0;

        &:active {
          color: ${token.colorText};
          background-color: ${token.colorFill};
        }
      }

      .ant-menu-item-only-child:first-child {
        border-top: none;
      }

      .ant-menu-submenu-title[aria-expanded='true'] {
        a {
          font-weight: 600;
          color: ${token.colorText} !important;
        }
      }

      .ant-menu-item-group-title {
        padding-top: 4px;
        padding-bottom: 4px;

        font-size: 12px;
        font-weight: 500;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;

        background: ${token.colorFillSecondary};
      }

      .ant-menu-item {
        width: calc(100% - 16px) !important;
        margin: 8px !important;
        border-radius: ${token.borderRadius}px;

        &:hover,
        &:active {
          color: ${token.colorText} !important;
          background: ${token.colorFillSecondary} !important;
        }
      }

      .ant-menu-item-active {
        width: calc(100% - 16px) !important;
        margin: 8px !important;
        background: ${token.colorFillSecondary};
        border-radius: ${token.borderRadius}px;
      }

      .ant-menu-item-selected {
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
});
