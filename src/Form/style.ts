import { createStyles } from 'antd-style';
import { isNumber } from 'lodash-es';

export const useStyles = createStyles(({ css, token, prefixCls, responsive }) => ({
  borderless: css`
    gap: 48px;
    .${prefixCls}-collapse .${prefixCls}-collapse-header {
      padding-block-end: 16px;
      border-block-end: 1px solid ${token.colorBorderSecondary};
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
      border-radius: ${token.borderRadius}px !important;
    }

    ${responsive.mobile} {
      gap: 0 !important;
    }
  `,
}));

export const useFlatGroupStyles = createStyles(({ cx, css, token, stylish }) => {
  return {
    borderless: cx(
      stylish.variantBorderlessWithoutHover,
      css`
        padding-inline: 0;
      `,
    ),
    filled: stylish.variantFilledWithoutHover,
    mobile: css`
      padding-block: 0;
      padding-inline: 16px;
      background: ${token.colorBgContainer};
      border-radius: 0;
    `,
    outlined: stylish.variantOutlinedWithoutHover,
    root: css`
      padding-inline: 16px;
      border-radius: ${token.borderRadiusLG}px;
    `,
  };
});

export const useFooterStyles = createStyles(({ css, token, responsive }) => {
  return {
    root: css`
      ${responsive.mobile} {
        padding: 16px;
        background: ${token.colorBgContainer};
        border-block-start: 1px solid ${token.colorBorderSecondary};
      }
    `,
  };
});

export const useGroupStyles = createStyles(({ css, token, responsive }) => {
  return {
    mobileGroupBody: css`
      padding-block: 0;
      padding-inline: 16px;
      background: ${token.colorBgContainer};
    `,
    mobileGroupHeader: css`
      padding: 16px;
      background: ${token.colorBgLayout};
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
      ${responsive.mobile} {
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
      }
    `,
  };
});

export const useItemStyles = createStyles(
  ({ css, responsive, prefixCls }, { minWidth }: { minWidth?: string | number }) => ({
    itemMinWidth: css`
      .${prefixCls}-form-item-control {
        width: ${isNumber(minWidth) ? `${minWidth}px` : minWidth};
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

        ${responsive.mobile} {
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
  }),
);

export const useSubmitFooterStyles = createStyles(({ responsive, css, token }) => ({
  floatFooter: css`
    position: fixed;
    z-index: 1000;
    inset-block-end: 24px;
    inset-inline-start: 50%;
    transform: translateX(-50%);

    width: max-content;
    padding: 8px;

    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 48px;
    box-shadow: ${token.boxShadowSecondary};
  `,
  footer: css`
    ${responsive.mobile} {
      margin-block-start: -${token.borderRadius}px;
      padding: 16px;
      background: ${token.colorBgContainer};
      border-block-start: 1px solid ${token.colorBorderSecondary};
    }
  `,
}));

export const useTitleStyles = createStyles(({ css, token }) => ({
  content: css`
    position: relative;
    text-align: start;
  `,

  desc: css`
    display: block;

    line-height: 1.44;
    color: ${token.colorTextDescription};
    word-wrap: break-word;
    white-space: pre-wrap;
  `,
  title: css`
    font-weight: 500;
    line-height: 1;
  `,
}));
