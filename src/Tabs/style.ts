import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    compact: css`
      &.${prefixCls}-tabs {
        .${prefixCls}-tabs-tab {
          margin: 4px;

          + [class*='ant-tabs-tab'] {
            margin: 4px;
          }
        }
      }
    `,
    dropdown: css`
      .${prefixCls}-tabs-dropdown-menu {
        padding: 4px;
        border: 1px solid ${cssVar.colorBorderSecondary};

        .${prefixCls}-tabs-dropdown-menu-item {
          border-radius: ${cssVar.borderRadius};
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
          color: ${cssVar.colorTextSecondary};
          transition: background-color 100ms ease-out;

          &:hover {
            border-radius: ${cssVar.borderRadius};
            color: ${cssVar.colorText};
            background: ${cssVar.colorFillTertiary};
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

export const variants = cva(styles.root, {
  defaultVariants: {
    compact: false,
    underlined: false,
    variant: 'rounded',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    variant: {
      square: null,
      rounded: styles.rounded,
      point: styles.point,
    },
    compact: {
      false: styles.margin,
      true: styles.compact,
    },
    underlined: {
      false: styles.hideHolder,
      true: null,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
