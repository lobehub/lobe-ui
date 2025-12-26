import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

// 动态类名常量（用于 className）
export const actionsHoverCls = 'ant-highlighter-highlighter-hover-actions';
export const langHoverCls = 'ant-highlighter-highlighter-hover-lang';
export const expandCls = 'ant-highlighter-highlighter-body-expand';
export const prefix = 'ant-highlighter';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    actions: cx(
      actionsHoverCls,
      css`
        position: absolute;
        z-index: 2;
        inset-block-start: 8px;
        inset-inline-end: 8px;

        opacity: 0;
      `,
    ),
    bodyCollapsed: css`
      height: 0;
      opacity: 0;
    `,
    bodyExpand: cx(expandCls),
    bodyRoot: css`
      overflow: hidden;
      transition: opacity 0.25s ${cssVar.motionEaseOut};
    `,
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    filled: cx(
      lobeStaticStylish.variantFilledWithoutHover,
      css`
        background: ${cssVar.colorFillQuaternary};
      `,
    ),
    headerBorderless: css`
      padding-inline: 0;
    `,

    headerFilled: css`
      background: transparent;
    `,

    headerOutlined: css`
      & + .${expandCls} {
        border-block-start: 1px solid ${cssVar.colorFillQuaternary};
      }
    `,

    headerRoot: css`
      cursor: pointer;
      position: relative;
      padding: 4px;
    `,

    lang: cx(
      langHoverCls,
      lobeStaticStylish.blur,
      css`
        position: absolute;
        z-index: 2;
        inset-block-end: 8px;
        inset-inline-end: 8px;

        font-family: ${cssVar.fontFamilyCode};
        color: ${cssVar.colorTextSecondary};

        opacity: 0;
        background: ${cssVar.colorFillQuaternary};

        transition: opacity 0.1s;
      `,
    ),
    nowrap: css`
      pre,
      code {
        text-wrap: nowrap;
      }
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: cx(
      prefix,
      css`
        position: relative;

        overflow: hidden;

        width: 100%;
        border-radius: ${cssVar.borderRadius};

        transition: background-color 100ms ${cssVar.motionEaseOut};

        .languageTitle {
          opacity: 0.5;
          filter: grayscale(100%);
          transition:
            opacity,
            grayscale 0.2s ${cssVar.motionEaseInOut};
        }

        .panel-actions {
          opacity: 0;
          transition: opacity 0.2s ${cssVar.motionEaseInOut};
        }

        &:hover {
          .languageTitle {
            opacity: 1;
            filter: grayscale(0%);
          }

          .panel-actions {
            opacity: 1;
          }

          .${actionsHoverCls} {
            opacity: 1;
          }

          .${langHoverCls} {
            opacity: 1;
          }
        }

        pre {
          height: 100%;
          font-size: 12px;
        }

        code {
          background: transparent !important;
        }
      `,
    ),
    shadow: lobeStaticStylish.shadow,
    wrap: css`
      pre,
      code {
        text-wrap: wrap;
      }
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    shadow: false,
    variant: 'filled',
    wrap: false,
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
    shadow: {
      false: null,
      true: styles.shadow,
    },
    wrap: {
      false: styles.nowrap,
      true: styles.wrap,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});

export const headerVariants = cva(styles.headerRoot, {
  defaultVariants: {
    variant: 'filled',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    variant: {
      filled: cx(styles.headerFilled, styles.headerOutlined),
      outlined: styles.headerOutlined,
      borderless: styles.headerBorderless,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});

export const bodyVariants = cva(styles.bodyRoot, {
  defaultVariants: {
    expand: true,
  },
  variants: {
    expand: {
      false: styles.bodyCollapsed,
      true: styles.bodyExpand,
    },
  },
});
