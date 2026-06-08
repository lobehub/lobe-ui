import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const prefix = 'lobe-code-diff';
export const compactActionsCls = `${prefix}-actions-compact`;
export const compactLangCls = `${prefix}-lang`;

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    actions: css`
      opacity: 0;
      transition: opacity 0.2s ${cssVar.motionEaseInOut};
    `,
    actionsCompact: cx(
      compactActionsCls,
      css`
        position: absolute;
        z-index: 2;
        inset-block-start: 8px;
        inset-inline-end: 8px;

        opacity: 0;

        transition: opacity 0.2s ${cssVar.motionEaseInOut};
      `,
    ),
    additions: css`
      font-family: ${cssVar.fontFamilyCode};
      font-size: 12px;
      color: ${cssVar.colorSuccess};
    `,
    body: css`
      overflow: auto;

      width: 100%;

      font-family: ${cssVar.fontFamilyCode};
      font-size: 13px;
      line-height: 1.6;
    `,
    bodyCollapsed: css`
      height: 0;
      opacity: 0;
    `,
    bodyRoot: css`
      overflow: hidden;
      transition: opacity 0.25s ${cssVar.motionEaseOut};
    `,
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    deletions: css`
      font-family: ${cssVar.fontFamilyCode};
      font-size: 12px;
      color: ${cssVar.colorError};
    `,
    filled: cx(
      lobeStaticStylish.variantFilledWithoutHover,
      css`
        background: ${cssVar.colorFillQuaternary};
      `,
    ),
    header: css`
      cursor: pointer;

      position: relative;

      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;

      padding: 4px;

      font-family: ${cssVar.fontFamilyCode};
      font-size: 13px;
      color: ${cssVar.colorTextSecondary};
    `,
    headerBorderless: css`
      padding-inline: 0;
    `,
    headerFilled: css`
      background: transparent;
    `,
    headerOutlined: css`
      & + .${prefix}-body {
        border-block-start: 1px solid ${cssVar.colorFillQuaternary};
      }
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    lang: cx(
      compactLangCls,
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
    root: cx(
      prefix,
      css`
        position: relative;

        overflow: hidden;

        width: 100%;
        border-radius: ${cssVar.borderRadius};

        transition: background-color 100ms ${cssVar.motionEaseOut};

        .language-title {
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
          .language-title {
            opacity: 1;
            filter: grayscale(0%);
          }

          .panel-actions {
            opacity: 1;
          }

          .${compactActionsCls} {
            opacity: 1;
          }

          .${compactLangCls} {
            opacity: 1;
          }
        }
      `,
    ),
    stats: css`
      display: flex;
      gap: 8px;
      align-items: center;
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    variant: 'filled',
  },

  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
  },
});

export const headerVariants = cva(styles.header, {
  defaultVariants: {
    variant: 'filled',
  },

  variants: {
    variant: {
      filled: cx(styles.headerFilled, styles.headerOutlined),
      outlined: styles.headerOutlined,
      borderless: styles.headerBorderless,
    },
  },
});

export const bodyVariants = cva(styles.bodyRoot, {
  defaultVariants: {
    expand: true,
  },
  variants: {
    expand: {
      false: styles.bodyCollapsed,
      true: null,
    },
  },
});
