import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const DEFAULT_PADDING = '12px 16px';

export const getPadding = (padding?: number | string) =>
  !padding && padding !== 0
    ? DEFAULT_PADDING
    : `${typeof padding === 'string' ? padding : `${padding}px`} !important`;

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: css`
      &.${prefixCls}-collapse {
        .${prefixCls}-collapse-header {
          padding-inline: 0;
        }
        .${prefixCls}-collapse-panel {
          padding-inline: 0;
          .${prefixCls}-collapse-body {
            padding-inline: 0;
          }
        }
      }
    `,
    desc: css`
      font-size: 12px;
      color: ${cssVar.colorTextDescription};
    `,
    filledDark: css`
      &.${prefixCls}-collapse {
        .${prefixCls}-collapse-item {
          background: ${cssVar.colorBgLayout};
          .${prefixCls}-collapse-panel {
            margin-inline: 3px;
            margin-block-end: 3px;
            border-radius: ${cssVar.borderRadius};
            ${lobeStaticStylish.variantOutlinedWithoutHover};
          }
        }
      }
    `,
    filledLight: css`
      &.${prefixCls}-collapse {
        .${prefixCls}-collapse-item {
          background: ${cssVar.colorFillQuaternary};
          .${prefixCls}-collapse-panel {
            margin-inline: 3px;
            margin-block-end: 3px;
            border-radius: ${cssVar.borderRadius};
            ${lobeStaticStylish.variantOutlinedWithoutHover};
            background: ${cssVar.colorBgContainer};
            ${lobeStaticStylish.shadow};
          }
        }
      }
    `,
    gapOutlined: css`
      &.${prefixCls}-collapse {
        border: none;
        background: transparent;
        .${prefixCls}-collapse-item {
          border: 1px solid ${cssVar.colorFillSecondary};
          background: ${cssVar.colorBgContainer};
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
          border: none;
          border-radius: ${cssVar.borderRadiusLG};
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
      transition: all 100ms ${cssVar.motionEaseOut};
    `,
    outlined: css`
      &.${prefixCls}-collapse {
        border: 1px solid ${cssVar.colorFillSecondary};
        background: ${cssVar.colorBgContainer};
        .${prefixCls}-collapse-item .${prefixCls}-collapse-header {
          transition: none;
        }
        .${prefixCls}-collapse-item-active .${prefixCls}-collapse-header {
          border-block-end: 1px solid ${cssVar.colorFillTertiary};
        }
        .${prefixCls}-collapse-item:not(:first-child) {
          .${prefixCls}-collapse-header {
            border-block-start: 1px solid ${cssVar.colorFillTertiary};
          }
        }
      }
    `,
    root: css`
      &.${prefixCls}-collapse {
        display: flex;
        flex-direction: column;
        background: transparent;

        .${prefixCls}-collapse-header {
          overflow: hidden;
          display: flex;
          flex: none;
          gap: 0.75em;
          align-items: flex-start;

          border-radius: 0 !important;

          .${prefixCls}-collapse-header-text {
            flex: 1;
          }

          .${prefixCls}-collapse-expand-icon {
            align-items: center;
            min-height: 28px;
            margin: 0;
            padding: 0;
          }

          .${prefixCls}-collapse-extra {
            display: flex;
            align-items: center;
            min-height: 28px;
          }
        }

        .${prefixCls}-collapse-panel {
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

export const variants = cva(styles.root, {
  compoundVariants: [
    {
      class: styles.gapOutlined,
      gap: true,
      variant: 'outlined',
    },
    {
      class: styles.filledDark,
      isDarkMode: true,
      variant: 'filled',
    },
    {
      class: styles.filledLight,
      isDarkMode: false,
      variant: 'filled',
    },
  ],
  defaultVariants: {
    collapsible: true,
    gap: false,
    isDarkMode: false,
  },

  variants: {
    collapsible: {
      false: styles.hideCollapsibleIcon,
      true: null,
    },
    gap: {
      false: null,
      true: styles.gapRoot,
    },
    isDarkMode: {
      false: null,
      true: null,
    },
    variant: {
      borderless: styles.borderless,
      filled: null,
      outlined: styles.outlined,
    },
  },
});
