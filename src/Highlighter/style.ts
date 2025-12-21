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
      height: 0;
      opacity: 0;
    `,
    bodyExpand: cx(expandCls),
    bodyRoot: css`
      overflow: hidden;
      transition: opacity 0.25s ${token.motionEaseOut};
    `,
    borderless: stylish.variantBorderlessWithoutHover,
    filled: cx(
      stylish.variantFilledWithoutHover,
      css`
        background: ${token.colorFillQuaternary};
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
        border-block-start: 1px solid ${token.colorFillQuaternary};
      }
    `,

    headerRoot: css`
      cursor: pointer;
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
        inset-inline-end: 8px;

        font-family: ${token.fontFamilyCode};
        color: ${token.colorTextSecondary};

        opacity: 0;
        background: ${token.colorFillQuaternary};

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

        width: 100%;
        border-radius: ${token.borderRadius}px;

        transition: background-color 100ms ${token.motionEaseOut};

        .languageTitle {
          opacity: 0.5;
          filter: grayscale(100%);
          transition:
            opacity,
            grayscale 0.2s ${token.motionEaseInOut};
        }

        .panel-actions {
          opacity: 0;
          transition: opacity 0.2s ${token.motionEaseInOut};
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
    shadow: stylish.shadow,
    wrap: css`
      pre,
      code {
        text-wrap: wrap;
      }
    `,
  };
});
