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
          inset-block-start: ${type === 'pure' ? 0 : '8px'};
          inset-inline-end: ${type === 'pure' ? 0 : '8px'};

          opacity: 0;
        `,
      ),

      container: cx(
        prefix,
        type !== 'pure' && typeStylish,
        css`
          position: relative;
          overflow: hidden;
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
            overflow: auto hidden;

            margin: 0 !important;
            padding: ${type === 'pure' ? 0 : `16px`} !important;

            white-space: break-spaces;

            background: none !important;
          }

          code {
            text-wrap: nowrap !important;
            background: transparent !important;
          }
        `,
      ),
      header: css`
        padding-block: 4px;
        padding-inline: 8px;
        background: ${token.colorFillQuaternary};
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
      scroller: css`
        overflow: auto;
        width: 100%;
        height: 100%;
      `,
      select: css`
        user-select: none;
        font-size: 14px;
        color: ${token.colorTextDescription};
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
