import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const prefix = 'lobe-code-diff';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    actions: css`
      position: absolute;
      z-index: 2;
      inset-block-start: 8px;
      inset-inline-end: 8px;

      opacity: 0;
      transition: opacity 0.2s ${cssVar.motionEaseInOut};
    `,
    additions: css`
      color: ${cssVar.colorSuccess};
      font-family: ${cssVar.fontFamilyCode};
      font-size: 12px;
    `,
    body: css`
      overflow: auto;

      width: 100%;

      font-family: ${cssVar.fontFamilyCode};
      font-size: 13px;
      line-height: 1.6;

      /* Override @pierre/diffs shadow DOM CSS variables */
      --pdiff-font-family: ${cssVar.fontFamilyCode};
      --pdiff-font-size: 13px;
      --pdiff-line-height: 1.6;
      --pdiff-bg-color: transparent;
      --pdiff-border-color: ${cssVar.colorBorderSecondary};
      --pdiff-gutter-bg: ${cssVar.colorFillQuaternary};
      --pdiff-gutter-color: ${cssVar.colorTextQuaternary};
      --pdiff-added-bg: ${cssVar.colorSuccessBgHover};
      --pdiff-added-highlight-bg: ${cssVar.colorSuccessBg};
      --pdiff-removed-bg: ${cssVar.colorErrorBgHover};
      --pdiff-removed-highlight-bg: ${cssVar.colorErrorBg};
      --pdiff-info-bg: ${cssVar.colorInfoBg};
    `,
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    deletions: css`
      color: ${cssVar.colorError};
      font-family: ${cssVar.fontFamilyCode};
      font-size: 12px;
    `,
    filled: cx(
      lobeStaticStylish.variantFilledWithoutHover,
      css`
        background: ${cssVar.colorFillQuaternary};
      `,
    ),
    header: css`
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;

      padding: 8px 12px;

      font-family: ${cssVar.fontFamilyCode};
      font-size: 13px;
      color: ${cssVar.colorTextSecondary};

      border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    `,
    headerBorderless: css`
      padding-inline: 0;
      border-block-end: none;
    `,
    headerFilled: css`
      background: transparent;
    `,
    headerOutlined: css`
      background: ${cssVar.colorFillQuaternary};
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

        &:hover {
          .${prefix}-actions {
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
      filled: styles.headerFilled,
      outlined: styles.headerOutlined,
      borderless: styles.headerBorderless,
    },
  },
});
