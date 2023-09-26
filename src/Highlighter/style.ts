import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ token, css, cx, prefixCls, stylish }, type: 'ghost' | 'block' | 'pure') => {
    const prefix = `${prefixCls}-highlighter`;
    const buttonHoverCls = `${prefix}-hover-btn`;
    const langHoverCls = `${prefix}-hover-lang`;

    const typeStylish = css`
      background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
      border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};

      &:hover {
        background-color: ${type === 'block' ? token.colorFillTertiary : token.colorFillQuaternary};
      }
    `;

    return {
      button: cx(
        buttonHoverCls,
        css`
          position: absolute;
          z-index: 2;
          top: ${type === 'pure' ? 0 : '8px'};
          right: ${type === 'pure' ? 0 : '8px'};

          opacity: 0;
        `,
      ),

      container: cx(
        prefix,
        type !== 'pure' && typeStylish,
        css`
          position: relative;
          overflow: auto;
          border-radius: ${token.borderRadius}px;
          transition: background-color 100ms ${token.motionEaseOut};

          &:hover {
            .${buttonHoverCls} {
              opacity: 1;
            }

            .${langHoverCls} {
              opacity: 1;
            }
          }

          .prism-code {
            background: none !important;
          }

          pre {
            margin: 0 !important;
            padding: ${type === 'pure' ? 0 : `16px 24px`} !important;
            background: none !important;
          }

          code {
            background: transparent !important;
          }
        `,
      ),
      header: css`
        padding: 4px 8px;
        background: ${token.colorFillQuaternary};
      `,
      lang: cx(
        langHoverCls,
        stylish.blur,
        css`
          position: absolute;
          z-index: 2;
          right: 0;
          bottom: 8px;

          font-family: ${token.fontFamilyCode};
          color: ${token.colorTextSecondary};

          opacity: 0;

          transition: opacity 0.1s;
        `,
      ),
      select: css`
        .${prefixCls}-select-selection-item {
          min-width: 100px;
          padding-inline-end: 0 !important;
          color: ${token.colorTextDescription};
          text-align: center;
        }
      `,
    };
  },
);
