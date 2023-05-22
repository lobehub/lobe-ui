import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, isDarkMode, css, cx, prefixCls }) => {
  const prefix = `${prefixCls}-highlighter`;
  const buttonHoverCls = `${prefix}-hover-btn`;
  const langHoverCls = `${prefix}-hover-lang`;

  return {
    container: cx(
      prefix,
      css`
        position: relative;

        pre {
          margin: 0 !important;
        }

        &:hover {
          .${buttonHoverCls} {
            opacity: 1;
          }

          .${langHoverCls} {
            opacity: 1;
          }
        }
      `,
    ),
    withBackground: cx(
      `${prefix}-background`,
      css`
        pre {
          padding: 12px !important;
          background: ${isDarkMode
            ? token.colorFillQuaternary
            : token.colorFillTertiary} !important;
          border-radius: 8px;
        }

        code {
          background: transparent !important;
        }
      `,
    ),

    button: cx(
      buttonHoverCls,
      css`
        position: absolute;
        z-index: 51;
        top: 8px;
        right: 8px;

        opacity: 0;
      `,
    ),
    lang: cx(
      langHoverCls,
      css`
        position: absolute;
        z-index: 50;
        right: 8px;
        bottom: 8px;

        color: ${token.colorTextPlaceholder};

        opacity: 0;

        transition: opacity 0.1s;
      `,
    ),
  };
});
