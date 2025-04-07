import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    compact: css`
      &.${prefixCls}-tabs {
        .${prefixCls}-tabs-tab {
          margin: 4px;

          + .${prefixCls}-tabs-tab {
            margin: 4px;
          }
        }
      }
    `,
    dropdown: css`
      .${prefixCls}-tabs-dropdown-menu {
        padding: 4px;
        border: 1px solid ${token.colorBorderSecondary};

        .${prefixCls}-tabs-dropdown-menu-item {
          border-radius: ${token.borderRadius}px;
        }
      }
    `,
    hideHolder: css`
      &.${prefixCls}-tabs {
        .${prefixCls}-tabs-content-holder {
          display: none;
        }

        .${prefixCls}-tabs-nav {
          margin: 0;

          &::before {
            display: none;
          }
        }
      }
    `,

    margin: css`
      &.${prefixCls}-tabs {
        .${prefixCls}-tabs-tab {
          margin: 8px;

          + .${prefixCls}-tabs-tab {
            margin: 8px;
          }
        }
      }
    `,
    point: css`
      &.${prefixCls}-tabs {
        &.${prefixCls}-tabs-top {
          .${prefixCls}-tabs-ink-bar {
            width: 8px !important;
            height: 4px;
            border-start-start-radius: 4px;
            border-start-end-radius: 4px;
          }
        }

        &.${prefixCls}-tabs-bottom {
          .${prefixCls}-tabs-ink-bar {
            width: 8px !important;
            height: 4px;
            border-end-start-radius: 4px;
            border-end-end-radius: 4px;
          }
        }

        &.${prefixCls}-tabs-left {
          .${prefixCls}-tabs-ink-bar {
            width: 4px;
            height: 8px !important;
            border-start-start-radius: 4px;
            border-end-start-radius: 4px;
          }
        }

        &.${prefixCls}-tabs-right {
          .${prefixCls}-tabs-ink-bar {
            width: 4px;
            height: 8px !important;
            border-start-end-radius: 4px;
            border-end-end-radius: 4px;
          }
        }
      }
    `,
    root: css`
      &.${prefixCls}-tabs {
        .${prefixCls}-tabs-tab {
          padding-block: 8px;
          padding-inline: 12px;
          color: ${token.colorTextSecondary};
          transition: background-color 100ms ease-out;

          &:hover {
            color: ${token.colorText};
            background: ${token.colorFillTertiary};
            border-radius: ${token.borderRadius}px;
          }
        }
      }
    `,
    rounded: css`
      &.${prefixCls}-tabs {
        &.${prefixCls}-tabs-top {
          .${prefixCls}-tabs-ink-bar {
            height: 3px;
            border-start-start-radius: 3px;
            border-start-end-radius: 3px;
          }
        }

        &.${prefixCls}-tabs-bottom {
          .${prefixCls}-tabs-ink-bar {
            height: 3px;
            border-end-start-radius: 3px;
            border-end-end-radius: 3px;
          }
        }

        &.${prefixCls}-tabs-left {
          .${prefixCls}-tabs-ink-bar {
            width: 3px;
            border-start-start-radius: 3px;
            border-end-start-radius: 3px;
          }
        }

        &.${prefixCls}-tabs-right {
          .${prefixCls}-tabs-ink-bar {
            width: 3px;
            border-start-end-radius: 3px;
            border-end-end-radius: 3px;
          }
        }
      }
    `,
  };
});
