import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ token, prefixCls, cx, css, stylish }) => {
  const offset = 6;

  return {
    active: css`
      &::before,
      &::after {
        background: ${token.colorText};
      }

      & {
        background: transparent;
      }

      &::before {
        top: 0;
        transform: rotate(-135deg);
      }

      &::after {
        top: 0;
        transform: rotate(135deg);
      }
    `,
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
      top: ${token.headerHeight + 1}px;

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
      border-top: 1px solid ${token.colorBorderSecondary};
    `,
    icon: cx(
      'site-burger-icon',
      css`
        position: relative;

        &::before,
        &::after {
          content: '';
          position: absolute;
          left: 0;
        }

        &::before {
          top: ${offset}px;
        }

        &::after {
          top: -${offset}px;
        }

        &,
        &::before,
        &::after {
          display: inline-block;

          width: 16px;
          height: 2px;

          background: ${token.colorTextSecondary};

          transition: all 150ms ease;
        }
      `,
    ),

    menu: css`
      background: transparent;
      border-inline-end: transparent !important;

      .${prefixCls}-menu-item-only-child:first-child {
        border-top: none;
      }

      > .${prefixCls}-menu-item-only-child,.${prefixCls}-menu-submenu-title {
        width: 100%;
        margin: 0 !important;
        border-top: 1px solid ${token.colorBorderSecondary};
        border-radius: 0;

        &:active {
          color: ${token.colorText};
          background-color: ${token.colorFill};
        }
      }

      .ant-menu-item-group-title {
        overflow: hidden;

        padding: 0;

        font-size: 12px;
        font-weight: 500;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .ant-menu-item-selected {
        width: 100%;
        margin: 0;

        color: ${token.colorText};

        background: ${token.colorFillSecondary};
        border-radius: 0;
      }

      .ant-menu-item,
      a::before {
        width: 100% !important;
        margin: 0 !important;
        border-radius: 0 !important;
      }
    `,
  };
});
