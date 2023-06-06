import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ token, css, cx, prefixCls }, type: 'ghost' | 'block' | 'prue') => {
    const prefix = `${prefixCls}-highlighter`;
    const buttonHoverCls = `${prefix}-hover-btn`;
    const langHoverCls = `${prefix}-hover-lang`;

    const typeStylish = css`
      background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
      border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};
      &:hover {
        background-color: ${type === 'prue' ? 'transparent' : token.colorFillTertiary};
      }
    `;

    return {
      container: cx(
        prefix,
        typeStylish,
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
            padding: ${type === 'prue' ? 0 : `16px 24px`} !important;
            background: none !important;
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
  },
);
