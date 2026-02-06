import { createStaticStyles, responsive } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  borderless: css`
    gap: 48px;
    .${prefixCls}-collapse .${prefixCls}-collapse-header {
      padding-block-end: 16px;
      border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    }

    .${prefixCls}-collapse-body {
      padding-inline: 0 !important;
    }
  `,
  filled: css`
    .${prefixCls}-collapse-body {
      padding-block: 0 !important;
    }
  `,
  outlined: css`
    .${prefixCls}-collapse-body {
      padding-block: 0 !important;
    }
  `,
  root: css`
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 16px;

    width: 100%;

    .${prefixCls}-form-item {
      margin: 0 !important;
    }

    .${prefixCls}-form-item .${prefixCls}-form-item-label > label {
      height: unset;
    }

    .${prefixCls}-row {
      position: relative;
      flex-wrap: nowrap;
    }

    .${prefixCls}-form-item-label {
      position: relative;
      flex: 1;
      max-width: 100%;
    }

    .${prefixCls}-form-item-row {
      align-items: center;
    }

    .${prefixCls}-form-item-control {
      position: relative;
      flex: 0;
      min-width: unset !important;
    }

    .${prefixCls}-collapse-item {
      border-radius: ${cssVar.borderRadius} !important;
    }

    ${responsive.sm} {
      gap: 0 !important;
    }
  `,
}));

export const variants = cva(styles.root, {
  defaultVariants: {
    variant: 'borderless',
  },

  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
  },
});

export const flatGroupStyles = createStaticStyles(({ cx, css, cssVar }) => {
  return {
    borderless: cx(
      lobeStaticStylish.variantBorderlessWithoutHover,
      css`
        padding-inline: 0;
      `,
    ),
    filled: cx(
      lobeStaticStylish.variantFilledWithoutHover,
      css`
        background: ${cssVar.colorFillQuaternary};
      `,
    ),
    mobile: css`
      padding-block: 0;
      padding-inline: 16px;
      border-radius: 0;
      background: ${cssVar.colorBgContainer};
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      padding-inline: 16px;
      border-radius: ${cssVar.borderRadiusLG};
    `,
  };
});

export const flatGroupVariants = cva(flatGroupStyles.root, {
  defaultVariants: {
    variant: 'borderless',
  },

  variants: {
    variant: {
      filled: flatGroupStyles.filled,
      outlined: flatGroupStyles.outlined,
      borderless: flatGroupStyles.borderless,
    },
  },
});

export const footerStyles = createStaticStyles(({ css, cssVar }) => {
  return {
    root: css`
      ${responsive.sm} {
        padding: 16px;
        border-block-start: 1px solid ${cssVar.colorBorderSecondary};
        background: ${cssVar.colorBgContainer};
      }
    `,
  };
});

export const groupStyles = createStaticStyles(({ css, cssVar }) => {
  return {
    mobileGroupBody: css`
      padding-block: 0;
      padding-inline: 16px;
      background: ${cssVar.colorBgContainer};
    `,
    mobileGroupHeader: css`
      padding: 16px;
      background: ${cssVar.colorBgLayout};
    `,
    title: css`
      align-items: center;
      font-size: 16px;
      font-weight: bold;
    `,
    titleBorderless: css`
      font-size: 18px;
      font-weight: bold;
    `,
    titleMobile: css`
      ${responsive.sm} {
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
      }
    `,
  };
});

export const titleVariants = cva(groupStyles.title, {
  defaultVariants: {
    variant: 'borderless',
  },

  variants: {
    variant: {
      filled: null,
      outlined: null,
      borderless: groupStyles.titleBorderless,
    },
  },
});

export const itemStyles = createStaticStyles(({ css }) => ({
  itemMinWidth: css`
    &.${prefixCls}-form-item .${prefixCls}-form-item-control {
      width: var(--form-item-min-width) !important;
    }
  `,
  itemNoDivider: css`
    &:not(:first-child) {
      padding-block-start: 0;
    }
  `,
  root: css`
    &.${prefixCls}-form-item {
      padding-block: 16px;
      padding-inline: 0;

      .${prefixCls}-form-item-label {
        text-align: start;
      }

      .${prefixCls}-row {
        gap: 12px;
        justify-content: space-between;

        > div {
          flex: unset;
          flex-grow: unset;
        }
      }

      .${prefixCls}-form-item-required::before {
        align-self: flex-start;
      }

      ${responsive.sm} {
        &.${prefixCls}-form-item-horizontal {
          .${prefixCls}-form-item-label {
            flex: 1 !important;
          }
          .${prefixCls}-form-item-control {
            flex: none !important;
          }
        }
      }
    }
  `,
  verticalLayout: css`
    &.${prefixCls}-form-item {
      .${prefixCls}-row {
        align-items: stretch;
      }
    }
  `,
}));

export const itemVariants = cva(itemStyles.root, {
  defaultVariants: {
    divider: false,
    itemMinWidth: false,
    layout: 'vertical',
  },

  variants: {
    itemMinWidth: {
      true: itemStyles.itemMinWidth,
      false: null,
    },
    divider: {
      true: null,
      false: itemStyles.itemNoDivider,
    },
    layout: {
      vertical: itemStyles.verticalLayout,
      horizontal: null,
    },
  },
});

export const submitFooterStyles = createStaticStyles(({ css, cssVar }) => ({
  floatFooter: css`
    position: fixed;
    z-index: 1000;
    inset-block-end: 24px;
    inset-inline-start: 50%;
    transform: translateX(-50%);

    width: max-content;
    padding: 8px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 48px;

    background: ${cssVar.colorBgContainer};
    box-shadow: ${cssVar.boxShadowSecondary};
  `,
  footer: css`
    ${responsive.sm} {
      margin-block-start: calc(-1 * ${cssVar.borderRadius});
      padding: 16px;
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
      background: ${cssVar.colorBgContainer};
    }
  `,
}));

export const titleStyles = createStaticStyles(({ css, cssVar }) => ({
  content: css`
    position: relative;
    text-align: start;
  `,

  desc: css`
    display: block;

    line-height: 1.44;
    color: ${cssVar.colorTextDescription};
    word-wrap: break-word;
    white-space: pre-wrap;
  `,
  title: css`
    font-weight: 500;
    line-height: 1;
  `,
}));
