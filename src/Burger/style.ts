import { createStaticStyles } from 'antd-style';

import { lobeStaticStylish } from '@/styles';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    container: css`
      cursor: pointer;
      width: ${cssVar.controlHeight};
      height: ${cssVar.controlHeight};
      border-radius: ${cssVar.borderRadius};
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
      inset-block-start: var(--burger-drawer-top, calc(var(--burger-header-height, 64px) + 1px));

      :focus-visible {
        outline: none;
      }

      .${prefixCls}-drawer {
        &-mask {
          ${lobeStaticStylish.blur};
          background-color: color-mix(in srgb, ${cssVar.colorBgLayout} 50%, transparent);
        }

        &-content-wrapper {
          box-shadow: none;
        }
      }
    `,
    drawerRootFullscreen: css`
      inset-block-start: 0;

      :focus-visible {
        outline: none;
      }

      .${prefixCls}-drawer {
        &-mask {
          ${lobeStaticStylish.blur};
          background-color: color-mix(in srgb, ${cssVar.colorBgLayout} 50%, transparent);
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
      padding-block-start: var(--burger-menu-padding-top, 0);
      border-inline-end: transparent !important;
      background: transparent;

      > .${prefixCls}-menu-item-only-child, .${prefixCls}-menu-submenu-title {
        width: 100%;
        margin: 0 !important;
        border-block-start: none;
        border-radius: 0;

        &:active {
          color: ${cssVar.colorText};
          background-color: ${cssVar.colorFill};
        }
      }

      .${prefixCls}-menu-item-only-child:first-child {
        border-block-start: none;
      }

      .${prefixCls}-menu-submenu-title[aria-expanded='true'] {
        a {
          font-weight: 600;
          color: ${cssVar.colorText} !important;
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

        background: ${cssVar.colorFillSecondary};
      }

      .${prefixCls}-menu-item {
        width: calc(100% - 16px) !important;
        margin: 8px !important;
        border-radius: ${cssVar.borderRadius};

        &:hover,
        &:active {
          color: ${cssVar.colorText} !important;
          background: ${cssVar.colorFillSecondary} !important;
        }
      }

      .${prefixCls}-menu-item-active {
        width: calc(100% - 16px) !important;
        margin: 8px !important;
        border-radius: ${cssVar.borderRadius};
        background: ${cssVar.colorFillSecondary};
      }

      .${prefixCls}-menu-item-selected {
        font-weight: 600;
        color: ${cssVar.colorBgLayout};
        background: ${cssVar.colorText};

        &:hover,
        &:active {
          color: ${cssVar.colorBgLayout} !important;
          background: ${cssVar.colorText} !important;
        }
      }
    `,
  };
});
