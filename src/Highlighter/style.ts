import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css, cx, prefixCls, stylish }) => {
  const prefix = `${prefixCls}-highlighter`;
  const actionsHoverCls = `${prefix}-highlighter-hover-actions`;
  const langHoverCls = `${prefix}-highlighter-hover-lang`;
  const expandCls = `${prefix}-highlighter-body-expand`;

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
      display: none;
      height: 0;
    `,
    bodyExpand: cx(expandCls),
    bodyRoot: css`
      overflow: hidden;
    `,
    borderless: stylish.variantBorderlessWithoutHover,
    filled: stylish.variantFilledWithoutHover,
    headerBorderless: css`
      padding-inline: 0;
    `,

    headerFilled: css`
      background: ${token.colorFillQuaternary};
    `,

    headerOutlined: css`
      & + .${expandCls} {
        border-block-start: 1px solid ${token.colorFillQuaternary};
      }
    `,

    headerRoot: css`
      position: relative;
      padding: 4px;
    `,

    lang: cx(
      langHoverCls,
      stylish.blur,
      css`
        position: absolute;
        z-index: 2;
        inset-block-end: 8px;
        inset-inline-end: 0;

        font-family: ${token.fontFamilyCode};
        color: ${token.colorTextSecondary};

        opacity: 0;

        transition: opacity 0.1s;
      `,
    ),
    nowrap: css`
      pre,
      code {
        text-wrap: nowrap;
      }
    `,
    outlined: stylish.variantOutlinedWithoutHover,
    root: cx(
      prefix,
      css`
        position: relative;
        overflow: hidden;
        border-radius: ${token.borderRadius}px;
        transition: background-color 100ms ${token.motionEaseOut};

        &:hover {
          .${actionsHoverCls} {
            opacity: 1;
          }

          .${langHoverCls} {
            opacity: 1;
          }
        }

        code {
          background: transparent !important;
        }
      `,
    ),
    select: css`
      user-select: none;

      position: absolute;
      inset-inline-start: 50%;
      transform: translateX(-50%);

      min-width: 100px;

      font-size: 14px;
      color: ${token.colorTextDescription};
      text-align: center;
    `,
    shadow: stylish.shadow,
    wrap: css`
      pre,
      code {
        text-wrap: wrap;
      }
    `,
  };
});
