import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ token, prefixCls, cx, css }) => {
  const offset = 6;

  return {
    fillRect: css`
      border-top: 1px dashed ${token.colorBorder};
      width: 100%;
      flex: 1;
    `,
    icon: cx(
      'site-burger-icon',
      css`
        position: relative;

        &,
        &::before,
        &::after {
          display: inline-block;
          height: 2px;
          background: ${token.colorTextSecondary};

          width: 16px;

          transition: all 150ms ease;
        }

        &::before,
        &::after {
          position: absolute;
          left: 0;

          content: '';
        }

        &::before {
          top: ${offset}px;
        }

        &::after {
          top: -${offset}px;
        }
      `,
    ),
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
      width: ${token.controlHeight}px;
      height: ${token.controlHeight}px;
      border-radius: ${token.borderRadius}px;
      cursor: pointer;
    `,

    drawerRoot: css`
      top: ${token.headerHeight + 1}px;

      :focus-visible {
        outline: none;
      }

      .${prefixCls}-drawer {
        &-mask {
          background-color: ${rgba(token.colorBgLayout, 0.8)};
          backdrop-filter: saturate(180%) blur(10px);
        }

        &-content-wrapper {
          box-shadow: none;
        }
      }
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

    menu: css`
      background: transparent;
      border-inline-end: transparent !important;

      .${prefixCls}-menu-item-only-child:first-child {
        border-top: none;
      }

      > .${prefixCls}-menu-item-only-child,.${prefixCls}-menu-submenu-title {
        border-radius: 0;
        margin: 0 !important;
        width: 100%;
        border-top: 1px dashed ${token.colorBorder};

        &:active {
          color: ${token.colorText};
          background-color: ${token.colorFill};
        }
      }

      .ant-menu-item-group-title {
        padding: 0;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
      }

      .ant-menu-item-selected {
        margin: 0;
        width: 100%;
        border-radius: 0;
        color: ${token.colorText};
        background: ${token.colorFillSecondary};
      }

      .ant-menu-item,
      a:before {
        margin: 0 !important;
        width: 100% !important;
        border-radius: 0 !important;
      }
    `,
  };
});
