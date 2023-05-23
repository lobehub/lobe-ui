import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  ({ token, css, cx, prefixCls }, type: 'ghost' | 'block' | 'prue') => {
    const prefix = `${prefixCls}-highlighter`;
    const buttonHoverCls = `${prefix}-hover-btn`;
    const langHoverCls = `${prefix}-hover-lang`;

    return {
      container: cx(
        prefix,
        css`
          position: relative;
          transition: background-color 100ms ${token.motionEaseOut};
          ${type === 'ghost' &&
          css`
            border: 1px solid ${token.colorBorder};
          `}
          background-color: ${type === 'block' ? rgba(token.colorBgElevated, 0.6) : 'transparent'};
          border-radius: ${token.borderRadiusLG}px;
          padding: ${type === 'prue' ? 0 : `16px 24px`};

          &:hover {
            background-color: ${type === 'prue' ? 'transparent' : token.colorFillTertiary};
          }

          pre {
            margin: 0 !important;
            padding: 0 !important;
          }

          code {
            background: transparent !important;
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
