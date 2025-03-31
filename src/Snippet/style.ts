import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, cx, token, prefixCls, isDarkMode }, type: 'ghost' | 'block') => {
    const typeStylish = css`
      background-color: ${type === 'block'
        ? isDarkMode
          ? token.colorFillTertiary
          : token.colorBgLayout
        : 'transparent'};
      border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};
      box-shadow: ${type === 'block' ? token.boxShadowTertiary : 'none'};
    `;

    return {
      container: cx(
        typeStylish,
        css`
          position: relative;

          overflow: hidden;

          max-width: 100%;
          height: 38px;
          padding-block: 0;
          padding-inline: 12px 8px;

          border-radius: ${token.borderRadius}px;

          transition: background-color 100ms ${token.motionEaseOut};

          .${prefixCls}-highlighter-shiki {
            position: relative;
            overflow: hidden;
            flex: 1;
          }

          .prism-code {
            background: none !important;
          }

          pre {
            overflow: auto hidden !important;
            display: flex;
            align-items: center;

            width: 100%;
            height: 36px !important;
            margin: 0 !important;

            line-height: 1;
            text-wrap: nowrap !important;

            background: none !important;
          }

          code[class*='language-'] {
            background: none !important;
          }
        `,
      ),
    };
  },
);
